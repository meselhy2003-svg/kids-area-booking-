import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trash2, 
  Upload, 
  Plus, 
  Image as ImageIcon, 
  Baby, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Eye, 
  X,
  Loader2,
  Compass
} from 'lucide-react';

const BASE_URL = 'https://backend-ados.vercel.app';
const BASE_IMAGE_URL = `${BASE_URL}/upload/media/`;

/**
 * Resolves full image URL from filename or path
 */
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const cleanPath = imagePath.replace(/^\/+/, '');
  return `${BASE_IMAGE_URL}${cleanPath}`;
};

export default function KidsAreaMediaManager({ 
  apiUrl = `${BASE_URL}/api/media/page/kidsArea`, 
  authToken,
  onUploadSuccess,
  onDeleteSuccess
}) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { docId, imageIndex, imageName, section }
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message }

  const heroFileInputRef = useRef(null);
  const exploreFileInputRef = useRef(null);

  // Show auto-dismissing toast notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 1. Fetch Media Data
  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      let response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      });

      // Fallback to /api/media if /api/media/page/kidsArea fails
      if (!response.ok && apiUrl.includes('/page/')) {
        response = await fetch(`${BASE_URL}/api/media`, {
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const rawData = json.data || (Array.isArray(json) ? json : []);
      setMediaList(rawData);
    } catch (err) {
      console.error('[KidsAreaMediaManager] Fetch error:', err);
      setError(err.message || 'Error connecting to the media server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [apiUrl]);

  // 2. Filter data: ONLY include page === 'kidsArea'
  const kidsAreaMediaDocs = useMemo(() => {
    return mediaList.filter(item => {
      const pageKey = (item.page || '').toLowerCase();
      return pageKey === 'kidsarea' || pageKey === 'kids-area' || pageKey === 'kids_area';
    });
  }, [mediaList]);

  // 3. Divide into Hero Media vs Explore Attractions Media
  const heroMediaDocs = useMemo(() => {
    return kidsAreaMediaDocs.filter(item => (item.section || '').toLowerCase() === 'hero');
  }, [kidsAreaMediaDocs]);

  const exploreMediaDocs = useMemo(() => {
    return kidsAreaMediaDocs.filter(item => {
      const sec = (item.section || '').trim().toLowerCase();
      return (
        sec === 'explore kids area attractions.' ||
        sec === 'explore kids area attractions' ||
        sec === 'explore' ||
        sec.includes('explore') ||
        sec.includes('attraction')
      );
    });
  }, [kidsAreaMediaDocs]);

  // Flatten images for grid rendering while preserving parent document reference
  const heroImages = useMemo(() => {
    const list = [];
    heroMediaDocs.forEach(doc => {
      if (Array.isArray(doc.images)) {
        doc.images.forEach((img, idx) => {
          list.push({
            docId: doc._id,
            docName: doc.name || 'Kids Area Hero Banner',
            imageName: img,
            imageIndex: idx,
            section: 'hero',
            fullUrl: getFullImageUrl(img)
          });
        });
      }
    });
    return list;
  }, [heroMediaDocs]);

  const exploreImages = useMemo(() => {
    const list = [];
    exploreMediaDocs.forEach(doc => {
      if (Array.isArray(doc.images)) {
        doc.images.forEach((img, idx) => {
          list.push({
            docId: doc._id,
            docName: doc.name || 'Explore Kids Area Attractions',
            imageName: img,
            imageIndex: idx,
            section: 'Explore Kids Area Attractions.',
            fullUrl: getFullImageUrl(img)
          });
        });
      }
    });
    return list;
  }, [exploreMediaDocs]);

  // 4. Handle Delete Image Action
  const handleDeleteImage = async () => {
    if (!deleteConfirm) return;
    const { docId, imageName, section } = deleteConfirm;

    setActionLoading(true);
    try {
      await fetch(`${apiUrl}/${docId}/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ imageName, section })
      });

      // Optimistic UI update: Remove deleted image from local state
      setMediaList(prev => prev.map(item => {
        if (item._id === docId) {
          return {
            ...item,
            images: (item.images || []).filter(img => img !== imageName)
          };
        }
        return item;
      }));

      showToast(`Image "${imageName}" deleted successfully.`, 'success');
      if (onDeleteSuccess) onDeleteSuccess({ docId, imageName });
    } catch (err) {
      console.error('[KidsAreaMediaManager] Delete error:', err);
      showToast('Failed to delete image. Please try again.', 'error');
    } finally {
      setActionLoading(false);
      setDeleteConfirm(null);
    }
  };

  // 5. Handle Upload New Media Action
  const handleFileUpload = async (event, targetSection) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setActionLoading(true);
    const formData = new FormData();
    formData.append('page', 'kidsArea');
    formData.append('section', targetSection);
    formData.append('name', targetSection === 'hero' ? 'Kids Area Hero Banner' : 'Kids Area Explore Attractions');

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const json = await res.json();
      showToast(`${files.length} image(s) uploaded successfully!`, 'success');
      
      // Refresh list to sync state
      await fetchMedia();
      if (onUploadSuccess) onUploadSuccess(json);
    } catch (err) {
      console.error('[KidsAreaMediaManager] Upload error:', err);
      showToast(err.message || 'Failed to upload image.', 'error');
    } finally {
      setActionLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20">
                <Baby className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Kids Area Media Manager
                </h1>
                <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                  Manage live images and banners for the Kids Soft Play area, Toddler Zones, and attractions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchMedia}
              disabled={loading || actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl transition border border-slate-700/80 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-pink-400' : ''}`} />
              <span>Refresh Media</span>
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {notification && (
          <div className={`p-4 rounded-xl flex items-center gap-3 shadow-lg transition-all animate-fadeIn ${
            notification.type === 'success' 
              ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-200' 
              : 'bg-rose-950/80 border border-rose-500/30 text-rose-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-6 bg-rose-950/40 border border-rose-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-rose-300">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Failed to connect to API</h3>
                <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchMedia}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* SECTION 1: HERO MEDIA */}
        <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 md:p-7 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/50 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-pink-400 animate-pulse" />
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  Hero Media
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    {heroImages.length} {heroImages.length === 1 ? 'Image' : 'Images'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Top carousel banner displayed on the Kids Area header (<code className="text-pink-400">section: "hero"</code>).
                </p>
              </div>
            </div>

            {/* Hidden File Input & Upload Button */}
            <input 
              type="file" 
              ref={heroFileInputRef} 
              onChange={(e) => handleFileUpload(e, 'hero')} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => heroFileInputRef.current?.click()}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-900 bg-pink-400 hover:bg-pink-300 active:scale-95 rounded-xl shadow-lg shadow-pink-500/20 transition disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Upload New Media</span>
            </button>
          </div>

          {/* GRID OR SKELETON / EMPTY STATE */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-52 bg-slate-700/40 rounded-xl animate-pulse border border-slate-700/30" />
              ))}
            </div>
          ) : heroImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-700/60 rounded-xl bg-slate-900/30">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-300">No media uploaded for this section yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                Upload vibrant hero banners to welcome parents and toddlers to the Kids Area.
              </p>
              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-pink-300 bg-pink-950/50 hover:bg-pink-900/50 border border-pink-500/30 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Hero Banner</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {heroImages.map((img, idx) => (
                <div 
                  key={`${img.docId}-${idx}`} 
                  className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700/60 shadow-md hover:shadow-pink-500/10 hover:border-pink-500/40 transition duration-300 flex flex-col"
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={img.fullUrl}
                      alt={img.imageName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400/0f172a/94a3b8?text=Image+Not+Found';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

                    {/* Quick Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewImage(img.fullUrl)}
                      className="absolute top-2.5 left-2.5 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 backdrop-blur-sm shadow-md"
                      title="Preview Full Size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Delete Button (Trash Icon) */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(img)}
                      className="absolute top-2.5 right-2.5 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 backdrop-blur-sm shadow-md hover:scale-110 active:scale-95"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Index Badge */}
                    <div className="absolute bottom-2 left-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[10px] font-mono text-pink-300 rounded font-bold">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Caption / Meta Footer */}
                  <div className="p-3 bg-slate-900 flex flex-col gap-1 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-200 truncate" title={img.imageName}>
                      {img.imageName}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      Doc ID: {img.docId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: EXPLORE ATTRACTIONS MEDIA */}
        <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 md:p-7 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/50 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  Explore Attractions Media
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {exploreImages.length} {exploreImages.length === 1 ? 'Image' : 'Images'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Playground games, ball pits, and soft play attractions (<code className="text-purple-400">section: "Explore Kids Area Attractions."</code>).
                </p>
              </div>
            </div>

            {/* Hidden File Input & Upload Button */}
            <input 
              type="file" 
              ref={exploreFileInputRef} 
              onChange={(e) => handleFileUpload(e, 'Explore Kids Area Attractions.')} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => exploreFileInputRef.current?.click()}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-900 bg-purple-400 hover:bg-purple-300 active:scale-95 rounded-xl shadow-lg shadow-purple-500/20 transition disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Upload New Media</span>
            </button>
          </div>

          {/* GRID OR SKELETON / EMPTY STATE */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-52 bg-slate-700/40 rounded-xl animate-pulse border border-slate-700/30" />
              ))}
            </div>
          ) : exploreImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-700/60 rounded-xl bg-slate-900/30">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                <Compass className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-300">No media uploaded for this section yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                Upload photos for the ball pit, slides, soft play, and creative art corners.
              </p>
              <button
                type="button"
                onClick={() => exploreFileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-300 bg-purple-950/50 hover:bg-purple-900/50 border border-purple-500/30 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Attraction Image</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {exploreImages.map((img, idx) => (
                <div 
                  key={`${img.docId}-${idx}`} 
                  className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700/60 shadow-md hover:shadow-purple-500/10 hover:border-purple-500/40 transition duration-300 flex flex-col"
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={img.fullUrl}
                      alt={img.imageName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400/0f172a/94a3b8?text=Image+Not+Found';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

                    {/* Quick Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewImage(img.fullUrl)}
                      className="absolute top-2.5 left-2.5 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 backdrop-blur-sm shadow-md"
                      title="Preview Full Size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Delete Button (Trash Icon) */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(img)}
                      className="absolute top-2.5 right-2.5 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 backdrop-blur-sm shadow-md hover:scale-110 active:scale-95"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Index Badge */}
                    <div className="absolute bottom-2 left-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[10px] font-mono text-purple-300 rounded font-bold">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Caption / Meta Footer */}
                  <div className="p-3 bg-slate-900 flex flex-col gap-1 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-200 truncate" title={img.imageName}>
                      {img.imageName}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      Doc ID: {img.docId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* MODAL 1: FULL SIZE IMAGE PREVIEW */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full transition shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain mx-auto" 
            />
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => !actionLoading && setDeleteConfirm(null)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Media Image?</h3>
                <p className="text-xs text-slate-400">This action will remove the image from the live display.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400"><strong className="text-slate-300">Image:</strong> {deleteConfirm.imageName}</p>
              <p className="text-slate-400"><strong className="text-slate-300">Section:</strong> {deleteConfirm.section}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteImage}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
