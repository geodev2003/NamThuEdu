// Cambridge YLE Parts Structure - Fixed number of parts per skill
// Teacher can choose any task type for each part

export const CAMBRIDGE_PARTS_STRUCTURE = {
  starters: {
    listening: {
      name: 'NGHE',
      icon: '🎧',
      totalParts: 4,
      duration: '~20 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' }
      ]
    },
    reading_writing: {
      name: 'ĐỌC VÀ VIẾT',
      icon: '📖',
      totalParts: 5,
      duration: '20 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' },
        { partNumber: 5, name: 'Part 5', description: 'Chọn dạng bài' }
      ]
    },
    speaking: {
      name: 'NÓI',
      icon: '🗣️',
      totalParts: 4,
      duration: '3-5 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' }
      ]
    }
  },
  
  movers: {
    listening: {
      name: 'NGHE',
      icon: '🎧',
      totalParts: 5,
      duration: '~25 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' },
        { partNumber: 5, name: 'Part 5', description: 'Chọn dạng bài' }
      ]
    },
    reading_writing: {
      name: 'ĐỌC VÀ VIẾT',
      icon: '📖',
      totalParts: 6,
      duration: '30 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' },
        { partNumber: 5, name: 'Part 5', description: 'Chọn dạng bài' },
        { partNumber: 6, name: 'Part 6', description: 'Chọn dạng bài' }
      ]
    },
    speaking: {
      name: 'NÓI',
      icon: '🗣️',
      totalParts: 4,
      duration: '5-7 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' }
      ]
    }
  },
  
  flyers: {
    listening: {
      name: 'NGHE',
      icon: '🎧',
      totalParts: 5,
      duration: '~25 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' },
        { partNumber: 5, name: 'Part 5', description: 'Chọn dạng bài' }
      ]
    },
    reading_writing: {
      name: 'ĐỌC VÀ VIẾT',
      icon: '📖',
      totalParts: 7,
      duration: '40 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' },
        { partNumber: 5, name: 'Part 5', description: 'Chọn dạng bài' },
        { partNumber: 6, name: 'Part 6', description: 'Chọn dạng bài' },
        { partNumber: 7, name: 'Part 7', description: 'Chọn dạng bài' }
      ]
    },
    speaking: {
      name: 'NÓI',
      icon: '🗣️',
      totalParts: 4,
      duration: '7-9 phút',
      parts: [
        { partNumber: 1, name: 'Part 1', description: 'Chọn dạng bài' },
        { partNumber: 2, name: 'Part 2', description: 'Chọn dạng bài' },
        { partNumber: 3, name: 'Part 3', description: 'Chọn dạng bài' },
        { partNumber: 4, name: 'Part 4', description: 'Chọn dạng bài' }
      ]
    }
  }
};
