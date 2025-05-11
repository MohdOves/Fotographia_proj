import React, { useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
const BATCH_SIZE = 10; // Process 10 images at a time

const FaceMatch = () => {
  const [cover, setCover] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const coverRef = useRef();
  const photosRef = useRef();

  // Load face-api.js models on mount
  React.useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Log the model paths we're trying to load
        console.log('Attempting to load models from:', {
          ssdMobilenetv1: MODEL_URL + '/ssd_mobilenetv1',
          faceRecognition: MODEL_URL + '/face_recognition',
          faceLandmark68: MODEL_URL + '/face_landmark_68',
          faceExpression: MODEL_URL + '/face_expression',
          ageGender: MODEL_URL + '/age_gender_model',
          tinyFaceDetector: MODEL_URL + '/tiny_face_detector'
        });

        // Load models one by one with individual error handling
        try {
          console.log('Loading SSD MobileNet...');
          await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL + '/ssd_mobilenetv1');
          console.log('SSD MobileNet loaded successfully');
        } catch (err) {
          console.error('Error loading SSD MobileNet:', err);
          throw new Error('Failed to load SSD MobileNet model');
        }

        try {
          console.log('Loading Face Recognition...');
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL + '/face_recognition');
          console.log('Face Recognition loaded successfully');
        } catch (err) {
          console.error('Error loading Face Recognition:', err);
          throw new Error('Failed to load Face Recognition model');
        }

        try {
          console.log('Loading Face Landmark...');
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL + '/face_landmark_68');
          console.log('Face Landmark loaded successfully');
        } catch (err) {
          console.error('Error loading Face Landmark:', err);
          throw new Error('Failed to load Face Landmark model');
        }

        // Load additional models if needed
        try {
          console.log('Loading Face Expression...');
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL + '/face_expression');
          console.log('Face Expression loaded successfully');
        } catch (err) {
          console.warn('Warning: Face Expression model failed to load:', err);
          // Don't throw error for optional models
        }

        try {
          console.log('Loading Age Gender...');
          await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL + '/age_gender_model');
          console.log('Age Gender loaded successfully');
        } catch (err) {
          console.warn('Warning: Age Gender model failed to load:', err);
          // Don't throw error for optional models
        }

        try {
          console.log('Loading Tiny Face Detector...');
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + '/tiny_face_detector');
          console.log('Tiny Face Detector loaded successfully');
        } catch (err) {
          console.warn('Warning: Tiny Face Detector model failed to load:', err);
          // Don't throw error for optional models
        }

        setModelsLoaded(true);
      } catch (err) {
        console.error('Error loading models:', err);
        setError(`Failed to load face recognition models: ${err.message}. Please check the console for more details.`);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  const handleCoverChange = (e) => {
    setCover(e.target.files[0] || null);
    setMatches([]);
  };

  const handleFolderChange = (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );
    setPhotos(files);
    setMatches([]);
    setProgress({ current: 0, total: files.length });
  };

  const processBatch = async (coverDescriptor, batch) => {
    const batchMatches = [];
    
    for (let photo of batch) {
      try {
        const img = await faceapi.bufferToImage(photo);
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        
        if (detection) {
          const dist = faceapi.euclideanDistance(coverDescriptor, detection.descriptor);
          if (dist < 0.6) {
            batchMatches.push(photo);
          }
        }
        
        setProgress(prev => ({
          ...prev,
          current: prev.current + 1
        }));
      } catch (err) {
        console.warn(`Failed to process image: ${photo.name}`, err);
      }
    }
    
    return batchMatches;
  };

  const runFaceMatch = async () => {
    if (!cover || photos.length === 0) return;
    
    setLoading(true);
    setMatches([]);
    setProgress({ current: 0, total: photos.length });

    try {
      // Load cover image and get descriptor
      const coverImg = await faceapi.bufferToImage(cover);
      const coverDetection = await faceapi.detectSingleFace(coverImg).withFaceLandmarks().withFaceDescriptor();
      
      if (!coverDetection) {
        throw new Error('No face found in cover photo!');
      }

      const coverDescriptor = coverDetection.descriptor;
      const allMatches = [];

      // Process photos in batches
      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        const batch = photos.slice(i, i + BATCH_SIZE);
        const batchMatches = await processBatch(coverDescriptor, batch);
        allMatches.push(...batchMatches);
        
        // Update matches as we find them
        setMatches([...allMatches]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: '40px auto', 
      background: 'linear-gradient(to bottom right, #ffffff, #f8f9ff)',
      borderRadius: 20, 
      boxShadow: '0 4px 30px rgba(108, 99, 255, 0.1)',
      padding: 40,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h2 style={{ 
        fontSize: '28px',
        color: '#2d3748',
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 700
      }}>
        Find Images
        <span style={{ 
          fontSize: '16px', 
          color: '#718096',
          marginLeft: '8px',
          fontWeight: 'normal' 
        }}></span>
      </h2>

      {error && (
        <div style={{ 
          color: '#fff',
          background: '#ff4d4f',
          marginBottom: 24,
          padding: '14px 20px',
          borderRadius: 12,
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(255, 77, 79, 0.2)'
        }}>
          {error}
        </div>
      )}

      {!modelsLoaded && (
        <div style={{ 
          color: '#6c63ff',
          background: '#f0f0ff',
          marginBottom: 24,
          padding: '14px 20px',
          borderRadius: 12,
          fontWeight: 500,
          textAlign: 'center'
        }}>
          Loading face recognition models...
        </div>
      )}

      <div style={{ 
        background: '#fff',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        marginBottom: 24
      }}>
        <label style={{ 
          display: 'block',
          fontSize: '16px',
          fontWeight: 600,
          color: '#4a5568',
          marginBottom: 12
        }}>Upload Cover Photo</label>
        <input 
          type="file" 
          accept="image/*" 
          ref={coverRef} 
          onChange={handleCoverChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '2px dashed #e2e8f0',
            borderRadius: 8,
            marginBottom: 16
          }}
        />
        {cover && (
          <div style={{ textAlign: 'center' }}>
            <img 
              src={URL.createObjectURL(cover)} 
              alt="cover" 
              style={{ 
                maxWidth: 200,
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(108, 99, 255, 0.15)',
                border: '3px solid #6c63ff',
                margin: '12px 0'
              }} 
            />
          </div>
        )}
      </div>

      <div style={{ 
        background: '#fff',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        marginBottom: 24
      }}>
        <label style={{ 
          display: 'block',
          fontSize: '16px',
          fontWeight: 600,
          color: '#4a5568',
          marginBottom: 12
        }}>Select Photos Folder</label>
        <input 
          type="file" 
          webkitdirectory="true"
          directory="true"
          multiple
          ref={photosRef} 
          onChange={handleFolderChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '2px dashed #e2e8f0',
            borderRadius: 8,
            marginBottom: 16
          }}
        />
        {photos.length > 0 && (
          <div style={{ 
            color: '#4a5568',
            fontSize: '14px',
            marginTop: 8
          }}>
            Selected {photos.length} photos from folder
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={runFaceMatch}
          disabled={!modelsLoaded || !cover || photos.length === 0 || loading}
          style={{ 
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            background: (!modelsLoaded || !cover || photos.length === 0 || loading) 
              ? '#cbd5e0'
              : 'linear-gradient(45deg, #6c63ff, #8c84ff)',
            border: 'none',
            borderRadius: 12,
            cursor: (!modelsLoaded || !cover || photos.length === 0 || loading) 
              ? 'not-allowed' 
              : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(108, 99, 255, 0.2)'
          }}
        >
          {!modelsLoaded ? 'Loading models...' : loading ? 'Matching...' : 'Find Matches'}
        </button>
      </div>

      {loading && progress.total > 0 && (
        <div style={{
          marginBottom: 24,
          textAlign: 'center'
        }}>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(progress.current / progress.total) * 100}%`,
              height: '100%',
              background: 'linear-gradient(45deg, #6c63ff, #8c84ff)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            marginTop: '8px',
            color: '#4a5568',
            fontSize: '14px'
          }}>
            Processing: {progress.current} of {progress.total} photos
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div style={{ 
          background: '#fff',
          padding: 24,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{ 
            fontSize: '20px',
            color: '#2d3748',
            marginBottom: 16,
            textAlign: 'center'
          }}>Matching Photos ({matches.length})</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 16,
            justifyContent: 'center'
          }}>
            {matches.map((m, i) => (
              <img 
                key={i} 
                src={URL.createObjectURL(m)} 
                alt={`match-${i}`}
                style={{ 
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: '3px solid #6c63ff',
                  boxShadow: '0 4px 12px rgba(108, 99, 255, 0.2)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'scale(1.05)'
                  }
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {!loading && matches.length === 0 && cover && photos.length > 0 && (
        <div style={{ 
          textAlign: 'center',
          color: '#718096',
          background: '#f7fafc',
          padding: '16px 24px',
          borderRadius: 12,
          fontWeight: 500
        }}>
          No matches found yet.
        </div>
      )}
    </div>
  );
};

export default FaceMatch; 