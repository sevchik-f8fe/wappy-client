export const combineAndShuffleArrays = (photos, tenor, storyblockVideos) => {
    const result = [];

    photos?.forEach(item => result.push({ source: 'photo', data: item }));
    tenor?.forEach(item => result.push({ source: 'tenor', data: item }));
    // nouns?.forEach(item => result.push({ source: 'noun', data: item }));
    storyblockVideos?.forEach(item => result.push({ source: 'storyblock', data: item }));
    // storyblockPhotos?.forEach(item => result.push({ source: 'storyblock', data: item }));

    return result.sort(() => Math.random() - 0.5);
}