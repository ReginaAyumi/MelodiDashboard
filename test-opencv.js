const cv = require('@u4/opencv4nodejs');

console.log('OpenCV Version:', cv.version);

// Membaca gambar dari file
const image = cv.imread('foto1.png');
cv.imshow('Image', image);
cv.waitKey();
