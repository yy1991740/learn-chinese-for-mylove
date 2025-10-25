// Main JavaScript file for Chinese Learning Website for Indonesian Girlfriend - Updated version

// Global variables
let isChinese = true; // Tracks current language
let currentEditingId = null;
let currentEditingType = null;

// Translation API configuration (for GitHub Pages deployment)
const API_CONFIG = {
    BACKEND_API_URL: '', // 禁用本地后端API
    USE_BACKEND_API: false, // 强制禁用后端API，使用前端翻译方案
    VOLC_ACCESS_KEY: localStorage.getItem('VOLC_ACCESS_KEY') || ''
};

// 注意：在GitHub Pages部署环境中，我们不使用本地后端API

// 添加一个简单的函数用于设置火山方舟API密钥
function setVolcApiKey(apiKey) {
    API_CONFIG.VOLC_ACCESS_KEY = apiKey;
    localStorage.setItem('VOLC_ACCESS_KEY', apiKey);
    console.log('火山方舟API密钥已设置，现在可以使用在线翻译功能');
    return true;
}

// 添加一个函数用于清除API密钥
function clearVolcApiKey() {
    API_CONFIG.VOLC_ACCESS_KEY = '';
    localStorage.removeItem('VOLC_ACCESS_KEY');
    console.log('火山方舟API密钥已清除');
    return true;
}

// 保留更新后的setApiKeys函数
function setApiKeys(accessKey) {
    API_CONFIG.VOLC_ACCESS_KEY = accessKey;
    localStorage.setItem('VOLC_ACCESS_KEY', accessKey);
    console.log('API密钥已更新（注意：现在只需要ACCESS_KEY）');
    return true;
}

// 注意：在GitHub Pages部署环境中，我们主要依赖前端翻译方案
// 移除硬编码的API密钥，使用用户可选配置

// 输出配置信息
if (API_CONFIG.VOLC_ACCESS_KEY) {
    console.log('已配置火山方舟API密钥，可以尝试使用在线翻译功能');
} else {
    console.log('未配置火山方舟API密钥，将使用本地词典和前端翻译服务作为备用');
    console.log('提示：在GitHub Pages环境中，出于安全考虑，建议不要在浏览器控制台设置API密钥');
    console.log('系统将优先使用LibreTranslate和MyMemory等前端可访问的翻译服务');
}

// 在GitHub Pages环境中初始化时不测试API连接，避免CORS和其他网络问题
console.log('GitHub Pages模式已启用，使用前端翻译方案...');

// Translation cache for faster responses
const translationCache = new Map();

// Function to set backend API URL
function setBackendApiUrl(url) {
    API_CONFIG.BACKEND_API_URL = url;
    localStorage.setItem('BACKEND_API_URL', url);
    console.log('Backend API URL set to:', url);
    return true;
}

// 不再使用secretKey，保留兼容性但忽略secretKey参数
function setApiKeys(accessKey, secretKey) {
    API_CONFIG.VOLC_ACCESS_KEY = accessKey;
    localStorage.setItem('VOLC_ACCESS_KEY', accessKey);
    console.log('API密钥已更新（注意：现在只需要ACCESS_KEY）');
    return true;
}

// Expose functions to window object for external access
window.setBackendApiUrl = setBackendApiUrl;
window.setApiKeys = setApiKeys;
window.setVolcApiKey = setVolcApiKey;
window.clearVolcApiKey = clearVolcApiKey;
window.testTranslation = async function(text = 'halo', skipCache = true) {
    console.log('===== 手动测试翻译功能 =====');
    console.log('测试文本:', text);
    console.log('是否跳过缓存:', skipCache);
    
    // 如果需要跳过缓存，先清除该文本的缓存
    if (skipCache) {
        const cacheKey = `${text}_id_zh`;
        if (translationCache.has(cacheKey)) {
            console.log('清除缓存:', cacheKey);
            translationCache.delete(cacheKey);
        }
    }
    
    try {
        const result = await translateWithDoubao(text, 'id', 'zh');
        console.log('翻译结果:', result);
        alert('翻译测试结果: ' + result);
        return result;
    } catch (error) {
        console.error('翻译测试失败:', error);
        alert('翻译失败: ' + error.message);
        return null;
    }
};

// We'll use the extended dictionary from extendedDictionary.js (loaded via script tag)
// No need to declare extendedIndoToChineseDict here as it's defined in extendedDictionary.js

// Indonesian to Chinese dictionary with pinyin (basic version)
const baseIndoToChineseDict = {
    // Basic words
    "halo": { chinese: "你好", pinyin: "Nǐ hǎo" },
    "terima kasih": { chinese: "谢谢", pinyin: "Xiè xiè" },
    "selamat tinggal": { chinese: "再见", pinyin: "Zài jiàn" },
    "maaf": { chinese: "对不起", pinyin: "Duì bù qǐ" },
    "aku mencintaimu": { chinese: "我爱你", pinyin: "Wǒ ài nǐ" },
    "tolong": { chinese: "请", pinyin: "Qǐng" },
    "silakan": { chinese: "请", pinyin: "Qǐng" },
    "sayang": { chinese: "宝贝", pinyin: "Bǎo bèi" },
    "sayangku": { chinese: "亲爱的", pinyin: "Qīn ài de" },
    "cantik": { chinese: "漂亮", pinyin: "Piào liang" },
    "rindu kamu": { chinese: "想你", pinyin: "Xiǎng nǐ" },
    "detak jantung": { chinese: "心跳", pinyin: "Xīn tiào" },
    "suka": { chinese: "喜欢", pinyin: "Xǐ huān" },
    
    // Extended vocabulary
    "ya": { chinese: "是", pinyin: "Shì" },
    "tidak": { chinese: "不", pinyin: "Bù" },
    "terima kasih banyak": { chinese: "非常感谢", pinyin: "Fēi cháng gǎn xiè" },
    "bagaimana": { chinese: "怎么样", pinyin: "Zěn me yàng" },
    "kamu": { chinese: "你", pinyin: "Nǐ" },
    "aku": { chinese: "我", pinyin: "Wǒ" },
    "dia": { chinese: "他/她", pinyin: "Tā" },
    "kami": { chinese: "我们", pinyin: "Wǒ men" },
    "anda": { chinese: "您", pinyin: "Nín" },
    "nama": { chinese: "名字", pinyin: "Míng zì" },
    "senang": { chinese: "高兴", pinyin: "Gāo xìng" },
    "sedih": { chinese: "伤心", pinyin: "Shāng xīn" },
    "lapar": { chinese: "饿", pinyin: "È" },
    "haus": { chinese: "渴", pinyin: "Kě" },
    "tired": { chinese: "累", pinyin: "Lèi" },
    "malas": { chinese: "懒", pinyin: "Lǎn" },
    
    // Common sentences
    "siapa nama kamu": { chinese: "你叫什么名字？", pinyin: "Nǐ jiào shén me míng zì?" },
    "apa kabar kamu": { chinese: "你好吗？", pinyin: "Nǐ hǎo ma?" },
    "aku sangat merindukanmu": { chinese: "我很想你", pinyin: "Wǒ hěn xiǎng nǐ" },
    "kamu sangat cantik": { chinese: "你很漂亮", pinyin: "Nǐ hěn piào liang" },
    "aku suka senyum kamu": { chinese: "我喜欢你的笑容", pinyin: "Wǒ xǐ huān nǐ de xiào róng" },
    "bagaimana harimu hari ini": { chinese: "你今天过得怎么样？", pinyin: "Nǐ jīn tiān guò dé zěn me yàng?" },
    "aku ingin makan denganmu": { chinese: "我想和你一起吃饭", pinyin: "Wǒ xiǎng hé nǐ yì qǐ chī fàn" },
    "menemui kamu adalah keberuntungan saya": { chinese: "遇见你是我的幸运", pinyin: "Yù jiàn nǐ shì wǒ de xìng yùn" },
    "aku suka belajar bahasa cina": { chinese: "我喜欢学习中文。", pinyin: "Wǒ xǐ huān xué xí zhōng wén." },
    "bagaimana cuaca hari ini": { chinese: "今天天气怎么样？", pinyin: "Jīn tiān tiān qì zěn me yàng?" },
    
    // Additional common sentences
    "aku sangat senang bertemu kamu": { chinese: "我很高兴见到你", pinyin: "Wǒ hěn gāo xìng jiàn dào nǐ" },
    "di mana kamu": { chinese: "你在哪里？", pinyin: "Nǐ zài nǎ lǐ?" },
    "kapan kita bertemu": { chinese: "我们什么时候见面？", pinyin: "Wǒ men shén me shí hòu jiàn miàn?" },
    "aku harus pergi sekarang": { chinese: "我现在必须走了", pinyin: "Wǒ xiàn zài bì xū zǒu le" },
    "tolong bantu aku": { chinese: "请帮我", pinyin: "Qǐng bāng wǒ" },
    "aku tahu": { chinese: "我知道", pinyin: "Wǒ zhī dào" },
    "aku tidak tahu": { chinese: "我不知道", pinyin: "Wǒ bù zhī dào" },
    "terima kasih atas bantuanmu": { chinese: "谢谢你的帮助", pinyin: "Xiè xiè nǐ de bāng zhù" },
    "semoga harimu menyenangkan": { chinese: "祝你有愉快的一天", pinyin: "Zhù nǐ yǒu yú kuài de yī tiān" },
    "selamat malam": { chinese: "晚安", pinyin: "Wǎn ān" }
};

// Create the main dictionary by merging base and extended dictionaries
// This will be updated when extended dictionary loads
let indoToChineseDict = { ...baseIndoToChineseDict };

// Function to merge extended dictionary when it loads
function mergeExtendedDictionary() {
    // Extended dictionary file is no longer available
    // Just use the base dictionary as is
    console.log('Using base dictionary only. Extended dictionary functionality removed.');
}

// Global variable to hold custom translations added by user
// Updated structure to separate words and sentences
let userAddedTranslations = {
    word: {},
    sentence: {}
};

// Function to add a new translation to userAddedTranslations
function addUserTranslation(indonesianText, chineseTranslation, pinyin, type = 'word', noteId = null) {
    const normalizedText = indonesianText.trim().toLowerCase();
    
    // Ensure type is valid
    if (!['word', 'sentence'].includes(type)) {
        type = 'word';
    }
    
    // Store with proper metadata
    userAddedTranslations[type][normalizedText] = {
        chinese: chineseTranslation,
        pinyin: pinyin,
        timestamp: new Date().toISOString(),
        noteId: noteId
    };
    
    // Also update the main dictionary for immediate use
    if (type === 'word') {
        indoToChineseDict[normalizedText] = { chinese: chineseTranslation, pinyin: pinyin };
    }
    
    // Save to localStorage for persistence
    saveUserTranslations();
    
    return true;
}

// Function to save user translations to localStorage
function saveUserTranslations() {
    try {
        localStorage.setItem('userAddedTranslations', JSON.stringify(userAddedTranslations));
        console.log('User translations saved successfully');
        return true;
    } catch (error) {
        console.error('Failed to save user translations:', error);
        showNotification(isChinese ? '保存自定义翻译失败！' : 'Gagal menyimpan terjemahan kustom!');
        return false;
    }
}

// Function to load user translations from localStorage
function loadUserTranslations() {
    try {
        const saved = localStorage.getItem('userAddedTranslations');
        if (saved) {
            const parsedData = JSON.parse(saved);
            
            // Handle both old and new data formats for backward compatibility
            if (parsedData.word !== undefined && parsedData.sentence !== undefined) {
                // New format with separate word/sentence categories
                userAddedTranslations = parsedData;
            } else {
                // Old format - convert to new format
                const oldFormatData = parsedData;
                userAddedTranslations = { word: {}, sentence: {} };
                
                // Add all to words category for simplicity
                Object.entries(oldFormatData).forEach(([key, value]) => {
                    userAddedTranslations.word[key] = {
                        chinese: value.chinese,
                        pinyin: value.pinyin,
                        timestamp: new Date().toISOString()
                    };
                });
                
                console.log('Converted old translation format to new format');
            }
            
            // Merge words with main dictionary
            if (userAddedTranslations.word) {
                Object.entries(userAddedTranslations.word).forEach(([indonesian, data]) => {
                    indoToChineseDict[indonesian] = { chinese: data.chinese, pinyin: data.pinyin };
                });
            }
            
            console.log('User translations loaded successfully. Words:', Object.keys(userAddedTranslations.word).length, 
                      'Sentences:', Object.keys(userAddedTranslations.sentence).length);
            return true;
        }
    } catch (error) {
        console.error('Failed to load user translations:', error);
        userAddedTranslations = { word: {}, sentence: {} };
    }
    return false;
}

// Function to restore user-added visual elements (sticky notes) from localStorage
function restoreUserAddedVisualElements() {
    try {
        const savedElements = localStorage.getItem('userAddedVisualElements');
        if (savedElements) {
            const elements = JSON.parse(savedElements);
            
            // Restore words
            if (elements.words && elements.words.length > 0) {
                elements.words.forEach(item => {
                    addNewWord(item.chinese, item.pinyin, item.indonesian);
                });
                console.log('Restored', elements.words.length, 'user-added words');
            }
            
            // Restore sentences
            if (elements.sentences && elements.sentences.length > 0) {
                elements.sentences.forEach(item => {
                    addNewSentence(item.chinese, item.pinyin, item.indonesian);
                });
                console.log('Restored', elements.sentences.length, 'user-added sentences');
            }
            
            return true;
        }
    } catch (error) {
        console.error('Failed to restore visual elements:', error);
    }
    return false;
}

// Function to save user-added visual elements to localStorage
function saveUserAddedVisualElements() {
    try {
        const elementsToSave = {
            words: [],
            sentences: []
        };
        
        // Collect user-added words (using alternative identification method)
        const allWordsNotes = document.querySelectorAll('#words .sticky-note');
        allWordsNotes.forEach(note => {
            // Use a safer approach to identify custom words - check for any tag with 'Custom' text
            const hasCustomTag = Array.from(note.querySelectorAll('.inline-block')).some(span => 
                span.textContent.includes('Custom')
            );
            
            if (hasCustomTag) {
                const chinese = note.querySelector('h3')?.textContent || '';
                const pinyin = note.querySelector('.text-lg.font-bubblegum')?.textContent || '';
                const indonesianElements = note.querySelectorAll('p');
                const indonesian = indonesianElements.length > 1 ? indonesianElements[1].textContent : '';
                
                elementsToSave.words.push({ chinese, pinyin, indonesian });
            }
        });
        
        // Collect user-added sentences (using alternative identification method)
        const allSentencesNotes = document.querySelectorAll('#sentences .sticky-note');
        allSentencesNotes.forEach(note => {
            // Use text content to identify custom sentences
            const allText = note.textContent;
            if (allText.includes('Custom sentence') || !isStandardDictionaryEntry(note)) {
                const chinese = note.querySelector('h3')?.textContent || '';
                const pinyin = note.querySelector('.text-lg.font-bubblegum')?.textContent || '';
                const indonesianElements = note.querySelectorAll('p');
                const indonesian = indonesianElements.length > 1 ? indonesianElements[1].textContent : '';
                
                elementsToSave.sentences.push({ chinese, pinyin, indonesian });
            }
        });
        
        localStorage.setItem('userAddedVisualElements', JSON.stringify(elementsToSave));
        console.log('Visual elements saved successfully');
        return true;
    } catch (error) {
        console.error('Failed to save visual elements:', error);
        return false;
    }
}

// Helper function to determine if a note is a standard dictionary entry
function isStandardDictionaryEntry(note) {
    // This is a simple heuristic - standard entries typically won't have editing capabilities
    // or specific custom markers
    return !note.querySelector('.edit-btn') && !note.querySelector('.delete-btn');
}

// 初始化逻辑已移至safeInit函数中
// 避免重复初始化导致的功能冲突

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Language Switching Functionality
function initLanguageSwitch() {
    const languageSwitch = document.getElementById('languageSwitch');
    const currentLanguage = document.getElementById('currentLanguage');
    
    // Define translations for key elements
    const translations = {
        'words': {
            'zh': '基础中文词语',
            'id': 'Kata-Kata Dasar Cina'
        },
        'sentences': {
            'zh': '实用中文句子',
            'id': 'Kalimat Berguna dalam Cina'
        },
        'about': {
            'zh': '关于',
            'id': 'Tentang'
        },
        'startLearning': {
            'zh': '开始学习',
            'id': 'Mulai Belajar'
        },
        'learnMore': {
            'zh': '了解更多',
            'id': 'Pelajari Lebih Lanjut'
        },
        'addMoreWords': {
            'zh': '添加更多词语',
            'id': 'Tambah Kata Lain'
        },
        'addMoreSentences': {
            'zh': '添加更多句子',
            'id': 'Tambah Kalimat Lain'
        },
        'aboutWebsite': {
            'zh': '关于这个网站',
            'id': 'Tentang Situs Ini'
        },
        'siteDescription1': {
            'zh': '这个网站是为我的印尼女友设计的，帮助她学习中文。网站采用粉色主题和卡通风格，让学习变得更加有趣和愉悦。',
            'id': 'Situs ini dirancang untuk pacar Indonesia saya, untuk membantu dia belajar bahasa Cina. Situs ini menggunakan tema pink dan gaya kartun, membuat belajar menjadi lebih menyenangkan dan bersemangat.'
        },
        'siteDescription2': {
            'zh': '网站包含基础中文词语和实用句子，每个词汇和句子都配有拼音、印尼语翻译和音频，方便学习发音。所有内容都以便利贴的形式展示，让学习体验更加轻松。',
            'id': 'Situs ini berisi kata-kata dasar dan kalimat berguna dalam bahasa Cina, setiap kata dan kalimat dilengkapi dengan pinyin, terjemahan Bahasa Indonesia dan audio, memudahkan untuk belajar pengucapan. Semua konten ditampilkan dalam bentuk catatan menempel, membuat pengalaman belajar lebih ringkas.'
        },
        'tipsHeader': {
            'zh': '学习小贴士',
            'id': 'Tips Belajar'
        },
        'tip1': {
            'zh': '每天花15-30分钟学习，坚持比一次性学习很长时间更有效。',
            'id': 'Belajar setiap hari selama 15-30 menit, konsistensi lebih efektif daripada belajar dalam waktu yang lama sekaligus.'
        },
        'tip2': {
            'zh': '多听音频，模仿发音，不要害怕犯错。',
            'id': 'Dengarkan audio lebih banyak, tiru pengucapan, jangan takut membuat kesalahan.'
        },
        'tip3': {
            'zh': '尝试在日常生活中使用学到的词语和句子。',
            'id': 'Cobalah menggunakan kata-kata dan kalimat yang telah dipelajari dalam kehidupan sehari-hari.'
        },
        'tip4': {
            'zh': '制作自己的闪卡，随时随地复习。',
            'id': 'Buat kartu flash Anda sendiri, ulangi kapanpun dan di mana pun.'
        }
    };
    
    if (languageSwitch && currentLanguage) {
        languageSwitch.addEventListener('click', () => {
            isChinese = !isChinese;
            currentLanguage.textContent = isChinese ? '中文 / Bahasa' : 'Bahasa / 中文';
            
            // Update navigation items
            const navItems = document.querySelectorAll('.nav-item, #mobileMenu a');
            if (navItems.length >= 3) {
                navItems[0].textContent = translations['words'][isChinese ? 'zh' : 'id'];
                navItems[1].textContent = translations['sentences'][isChinese ? 'zh' : 'id'];
                navItems[2].textContent = translations['about'][isChinese ? 'zh' : 'id'];
            }
            
            // Update section headers
            const sectionHeaders = document.querySelectorAll('section > div > div.text-center h2');
            if (sectionHeaders.length >= 3) {
                sectionHeaders[0].textContent = translations['words'][isChinese ? 'zh' : 'id'];
                sectionHeaders[1].textContent = translations['sentences'][isChinese ? 'zh' : 'id'];
                sectionHeaders[2].textContent = translations['aboutWebsite'][isChinese ? 'zh' : 'id'];
            }
            
            // Update buttons
            document.getElementById('addMoreWords').textContent = translations['addMoreWords'][isChinese ? 'zh' : 'id'];
            document.getElementById('addMoreWords').innerHTML = `<i class="fa fa-plus mr-2"></i> ${translations['addMoreWords'][isChinese ? 'zh' : 'id']}`;
            document.getElementById('addMoreSentences').textContent = translations['addMoreSentences'][isChinese ? 'zh' : 'id'];
            document.getElementById('addMoreSentences').innerHTML = `<i class="fa fa-plus mr-2"></i> ${translations['addMoreSentences'][isChinese ? 'zh' : 'id']}`;
            
            // Update buttons in hero section
            const heroButtons = document.querySelectorAll('.hero-buttons a');
            if (heroButtons.length >= 2) {
                heroButtons[0].innerHTML = `<i class="fa fa-book mr-2"></i> ${translations['startLearning'][isChinese ? 'zh' : 'id']}`;
                heroButtons[1].innerHTML = `<i class="fa fa-info-circle mr-2"></i> ${translations['learnMore'][isChinese ? 'zh' : 'id']}`;
            }
            
            // Update about section content
            const aboutParagraphs = document.querySelectorAll('#about p');
            if (aboutParagraphs.length >= 2) {
                aboutParagraphs[0].textContent = translations['siteDescription1'][isChinese ? 'zh' : 'id'];
                aboutParagraphs[1].textContent = translations['siteDescription2'][isChinese ? 'zh' : 'id'];
            }
            
            // Update tips header
            const tipsHeader = document.querySelector('#about h3');
            if (tipsHeader) {
                tipsHeader.textContent = translations['tipsHeader'][isChinese ? 'zh' : 'id'];
            }
            
            // Update tips list
            const tipsItems = document.querySelectorAll('#about ul li span');
            if (tipsItems.length >= 4) {
                tipsItems[0].textContent = translations['tip1'][isChinese ? 'zh' : 'id'];
                tipsItems[1].textContent = translations['tip2'][isChinese ? 'zh' : 'id'];
                tipsItems[2].textContent = translations['tip3'][isChinese ? 'zh' : 'id'];
                tipsItems[3].textContent = translations['tip4'][isChinese ? 'zh' : 'id'];
            }
            
            // Show a notification
            showNotification(isChinese ? '语言已切换为中文' : 'Bahasa telah diubah ke Bahasa Indonesia');
        });
    }
}

// Audio Playback Functionality
function initAudioPlayback() {
    const audioButtons = document.querySelectorAll('.audio-btn');
    
    audioButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent triggering the sticky note click
            
            // Get the Chinese text from the sticky note
            // Now supports both .word-sticky, .sentence-sticky, and .sticky-note classes
            let parent = button.closest('.word-sticky');
            if (!parent) parent = button.closest('.sentence-sticky');
            if (!parent) parent = button.closest('.sticky-note');
            
            if (parent) {
                const chineseText = parent.querySelector('h3').textContent;
                
                // Visual feedback that audio is playing
                button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
                
                // Use Web Speech API for text-to-speech
                speakText(chineseText, 'zh-CN');
                
                // Reset button icon after audio finishes
                setTimeout(() => {
                    button.innerHTML = '<i class="fa fa-volume-up"></i>';
                }, 1500);
            }
        });
    });
}

// Text-to-Speech function using Web Speech API with optimized settings for better pronunciation mimicry
function speakText(text, lang) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.75; // Slower rate for better clarity and mimicry
        utterance.pitch = 1.1; // Slightly higher pitch for better pronunciation clarity
        utterance.volume = 1.0; // Full volume
        
        // Try to find a voice with better Chinese pronunciation
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;
        
        // First try to find a Chinese voice
        for (let voice of voices) {
            if (voice.lang === 'zh-CN' && voice.localService) {
                selectedVoice = voice;
                break;
            }
        }
        
        // If no specific Chinese voice found, try to find any voice with good pronunciation
        if (!selectedVoice) {
            for (let voice of voices) {
                if ((voice.lang.includes('zh') || voice.name.includes('Chinese')) && voice.localService) {
                    selectedVoice = voice;
                    break;
                }
            }
        }
        
        // Apply the selected voice if found
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        speechSynthesis.speak(utterance);
    } else {
        console.log('Web Speech API not supported in this browser.');
        showNotification(isChinese ? '您的浏览器不支持文本转语音。' : 'Browser Anda tidak mendukung teks-ke-suara.');
    }
}

// Using the global translationCache

// Alternative translation service - MyMemory API
async function translateWithMyMemory(text, sourceLang = 'id', targetLang = 'zh') {
    try {
        const encodedText = encodeURIComponent(text);
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
        
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            // Only log non-4xx errors or limit logging frequency
            if (response.status >= 500) {
                console.warn(`MyMemory API server error: ${response.status}`);
            }
            return null;
        }
        
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        }
        
        return null; // Return null instead of throwing error
    } catch (error) {
        // Only log specific errors, skip network errors that are expected
        if (error.name !== 'AbortError' && !error.message.includes('Failed to fetch')) {
            console.warn('MyMemory API request skipped:', error.message);
        }
        return null;
    }
}

// LibreTranslate API translation function with retry mechanism
async function translateWithLibreTranslate(text, sourceLang = 'id', targetLang = 'zh', retryCount = 0) {
    // Check cache first
    const cacheKey = `${text}_${sourceLang}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }
    
    // Limit cache size to prevent memory issues
    if (translationCache.size > 100) {
        const firstKey = translationCache.keys().next().value;
        translationCache.delete(firstKey);
    }
    
    try {
        // Using public LibreTranslate instance that supports CORS with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
        
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Handle 429 error with exponential backoff
        if (response.status === 429 && retryCount < 2) {
            const delay = Math.pow(2, retryCount) * 1000; // 1s, then 2s
            console.log(`Rate limited, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return translateWithLibreTranslate(text, sourceLang, targetLang, retryCount + 1);
        }
        
        if (!response.ok) {
            // Only log server errors, not client errors that are expected
            if (response.status >= 500) {
                console.warn(`LibreTranslate API server error: ${response.status}`);
            }
            // Skip alternative service for certain error types
            if ([400, 404].includes(response.status)) {
                return null;
            }
        } else {
            const data = await response.json();
            // Cache the result
            translationCache.set(cacheKey, data.translatedText);
            return data.translatedText;
        }
    } catch (error) {
        // Only log specific errors, skip expected network errors
        if (error.name !== 'AbortError' && !error.message.includes('Failed to fetch')) {
            console.warn('LibreTranslate API request skipped:', error.message);
        }
    }
    
    // If LibreTranslate fails, silently try MyMemory as alternative
    return await translateWithMyMemory(text, sourceLang, targetLang);
}

// Simple pinyin conversion map (expanded version)
const pinyinMap = {
    '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ', '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
    '你': 'nǐ', '我': 'wǒ', '他': 'tā', '她': 'tā', '它': 'tā', '们': 'men',
    '好': 'hǎo', '坏': 'huài', '大': 'dà', '小': 'xiǎo', '高': 'gāo', '低': 'dī',
    '是': 'shì', '不': 'bù', '有': 'yǒu', '没': 'méi', '在': 'zài', '来': 'lái', '去': 'qù',
    '人': 'rén', '中国': 'zhōng guó', '印尼': 'yìn ní', '语': 'yǔ', '中文': 'zhōng wén',
    '学习': 'xué xí', '朋友': 'péng yǒu', '谢谢': 'xiè xiè', '再见': 'zài jiàn', '请': 'qǐng',
    '水': 'shuǐ', '饭': 'fàn', '茶': 'chá', '咖啡': 'kā fēi', '吃': 'chī', '喝': 'hē',
    '今天': 'jīn tiān', '明天': 'míng tiān', '昨天': 'zuó tiān', '年': 'nián', '月': 'yuè', '日': 'rì',
    '可以': 'kě yǐ', '帮助': 'bāng zhù', '喜欢': 'xǐ huān', '不喜欢': 'bù xǐ huān',
    '是': 'shì', '不是': 'bù shì', '的': 'de', '和': 'hé', '或': 'huò', '但是': 'dàn shì',
    '早上': 'zǎo shàng', '下午': 'xià wǔ', '晚上': 'wǎn shàng', '时间': 'shí jiān',
    '工作': 'gōng zuò', '学校': 'xué xiào', '家庭': 'jiā tíng', '城市': 'chéng shì', '国家': 'guó jiā',
    '请': 'qǐng', '谢谢': 'xiè xiè', '对不起': 'duì bù qǐ', '没关系': 'méi guān xi',
    '多少钱': 'duō shǎo qián', '便宜': 'pián yi', '贵': 'guì',
    '请问': 'qǐng wèn', '哪里': 'nǎ lǐ', '这里': 'zhè lǐ', '那里': 'nà lǐ',
    '爱': 'ài', '非常': 'fēi cháng', '很': 'hěn', '太': 'tài', '也': 'yě', '还': 'hái',
    '可以': 'kě yǐ', '需要': 'xū yào', '想要': 'xiǎng yào', '能够': 'néng gòu',
    '什么': 'shén me', '谁': 'shuí', '为什么': 'wèi shén me', '怎么样': 'zěn me yàng',
    '是': 'shì', '有': 'yǒu', '在': 'zài', '做': 'zuò', '说': 'shuō', '看': 'kàn', '听': 'tīng'
};

// 改进的拼音生成函数，使用pinyin-pro库
function generatePinyin(chineseText) {
    // 检查pinyin-pro库是否已加载
    if (window.pinyinPro) {
        try {
            // 使用pinyin-pro库生成带声调的拼音
            // 对于单个字符和词语都能准确处理
            return window.pinyinPro.pinyin(chineseText, { toneType: 'symbol', type: 'join' });
        } catch (error) {
            console.error('拼音生成出错:', error);
        }
    }
    
    // 降级处理：使用本地映射表（当pinyin-pro库不可用时）
    // 首先尝试完整匹配
    if (pinyinMap[chineseText]) {
        return pinyinMap[chineseText];
    }
    
    // 尝试分词匹配
    let pinyin = '';
    let i = 0;
    const textLength = chineseText.length;
    
    while (i < textLength) {
        let foundMatch = false;
        
        // 尝试匹配最长可能的词语
        const maxLength = Math.min(4, textLength - i);
        
        for (let length = maxLength; length >= 1; length--) {
            const substring = chineseText.substring(i, i + length);
            
            if (pinyinMap[substring]) {
                pinyin += pinyinMap[substring] + ' ';
                i += length;
                foundMatch = true;
                break;
            }
        }
        
        // 如果没有匹配到，保留原字符
        if (!foundMatch) {
            pinyin += chineseText[i] + ' ';
            i++;
        }
    }
    
    return pinyin.trim() || chineseText;
}

// Check if API configuration is valid
function checkApiConfig() {
    if (API_CONFIG.USE_BACKEND_API) {
        return API_CONFIG.BACKEND_API_URL !== '';
    } else {
        // 更新为只检查VOLC_ACCESS_KEY，因为现在使用Bearer Token认证，不需要secretKey
        return API_CONFIG.VOLC_ACCESS_KEY !== '';
    }
}

// Detect language (simple detection based on character sets)
function detectLanguage(text) {
    // Check for Chinese characters
    if (/[\u4e00-\u9fff]/.test(text)) {
        return 'zh';
    }
    // Check for Indonesian (Javanese script) or assume Indonesian for Latin characters
    if (/[a-zA-Z]/.test(text)) {
        return 'id';
    }
    // Default to Chinese if uncertain
    return 'zh';
}

// Translate text using backend API
async function translateWithBackendAPI(text, sourceLang = null, targetLang = null) {
    try {
        // Auto-detect languages if not specified
        if (!sourceLang) {
            sourceLang = detectLanguage(text);
        }
        if (!targetLang) {
            targetLang = sourceLang === 'zh' ? 'id' : 'zh';
        }

        // Check cache first
        const cacheKey = `${text}_${sourceLang}_${targetLang}`;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        // Limit cache size
        if (translationCache.size > 100) {
            const firstKey = translationCache.keys().next().value;
            translationCache.delete(firstKey);
        }

        const response = await fetch(`${API_CONFIG.BACKEND_API_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                sourceLang,
                targetLang
            })
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Cache the result
        translationCache.set(cacheKey, data.translation);
        return data.translation;
    } catch (error) {
        console.error('Backend API translation failed:', error);
        throw error;
    }
}

// Generate signature for Volcano API (if needed for direct frontend calls)
function generateVolcSign(accessKey, secretKey, method, uri, headers, query, body) {
    try {
        // This is a simplified version for frontend use
        // In production, this should be handled by backend only
        console.warn('Signature generation should ideally be done on the backend');
        
        // For demonstration purposes only
        const combined = `${method}${uri}${JSON.stringify(headers)}${query}${body}`;
        // Note: This is not a real HMAC implementation, just a placeholder
        return 'frontend_signature_placeholder';
    } catch (error) {
        console.error('Failed to generate signature:', error);
        throw error;
    }
}

// Direct translation using Volcano Ark API (Doubao-Seed-Translation)
async function translateWithDoubao(text, sourceLang = null, targetLang = null, skipCache = false) {
    console.log('===== 进入translateWithDoubao函数 =====');
    console.log('输入文本:', text);
    console.log('API_CONFIG对象:', JSON.stringify(API_CONFIG));
    console.log('checkApiConfig结果:', checkApiConfig());
    
    try {
        // Auto-detect languages if not specified
        if (!sourceLang) {
            sourceLang = detectLanguage(text);
            console.log('自动检测源语言:', sourceLang);
        }
        if (!targetLang) {
            targetLang = sourceLang === 'zh' ? 'id' : 'zh';
            console.log('自动检测目标语言:', targetLang);
        }

        // Skip if API key is not configured
        if (!API_CONFIG.VOLC_ACCESS_KEY) {
            console.log('VOLC_ACCESS_KEY not configured, skipping API translation');
            // 不再使用本地词典作为备用
            throw new Error('API key not configured');
        }
        console.log('API密钥已配置，准备调用翻译API');
        console.log('是否跳过缓存:', skipCache);

        // Check cache first
        const cacheKey = `${text}_${sourceLang}_${targetLang}`;
        // 只有在不跳过缓存且缓存存在时才使用缓存
        if (!skipCache && translationCache.has(cacheKey)) {
            console.log('使用缓存的翻译结果');
            return translationCache.get(cacheKey);
        }

        // Limit cache size
        if (translationCache.size > 100) {
            const firstKey = translationCache.keys().next().value;
            translationCache.delete(firstKey);
        }

        // 使用正确的火山方舟API请求格式
        const requestBody = {
            model: 'doubao-seed-translation-250915',
            input: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: text,
                            translation_options: {
                                source_language: sourceLang,
                                target_language: targetLang
                            }
                        }
                    ]
                }
            ]
        };

        // 设置认证头，按照用户指南使用Bearer Token方式，并添加用户提供的Access Key和Endpoint ID
        const headers = {
            'Authorization': `Bearer ${API_CONFIG.VOLC_ACCESS_KEY}`,
            'Content-Type': 'application/json',
            'X-Volc-AK': 'AKLTYjVmY2IzNDIyM2U5NDk2YThjOGUyNmY0NGNjYzZhYTg',
            'X-Volc-Endpoint-ID': 'ep-20251025212759-bfkl9'
        };

        // 使用正确的火山方舟API端点
        const apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/responses';
        console.log(`正在调用火山方舟API: ${apiUrl}`);
        console.log('API密钥状态:', API_CONFIG.VOLC_ACCESS_KEY ? '已配置' : '未配置');
        console.log('请求头:', JSON.stringify(headers));
        console.log('请求体:', JSON.stringify(requestBody));
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        // 详细的错误处理
        if (!response.ok) {
            try {
                const errorData = await response.json();
                console.error('API错误详情:', errorData);
                throw new Error(`火山方舟API错误: ${response.status} - ${errorData.error?.message || '未知错误'}`);
            } catch (jsonError) {
                throw new Error(`API请求失败: ${response.status} - 无法解析错误响应`);
            }
        }

        const data = await response.json();
        
        // 检查API返回的错误
        if (data.error) {
            console.error('API错误:', data.error);
            throw new Error(`API错误: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        // 检查返回数据格式并提取翻译结果
        if (data.output && data.output.length > 0) {
            // 尝试多种可能的结果路径
            let translation = null;
            
            // 路径1: output[0].content[0].text
            if (data.output[0].content && data.output[0].content.length > 0 && data.output[0].content[0].text) {
                translation = data.output[0].content[0].text.trim();
            }
            // 路径2: output[0].text
            else if (data.output[0].text) {
                translation = data.output[0].text.trim();
            }
            // 路径3: 尝试提取任何可能的文本字段
            else {
                // 将整个响应转为字符串，尝试提取有用信息
                const responseStr = JSON.stringify(data);
                console.log('原始响应数据:', responseStr);
                throw new Error('无法从API响应中提取翻译结果，请检查响应格式');
            }
            
            if (translation) {
                console.log(`翻译成功: ${text} -> ${translation}`);
                // 缓存结果
                translationCache.set(cacheKey, translation);
                return translation;
            }
        }
        
        console.error('无效的API响应格式:', data);
        throw new Error('无效的API响应格式');
        
    } catch (error) {
        console.error('火山方舟翻译失败:', error.message);
        // 直接抛出错误，不再使用本地词典作为备用
        throw error;
    }
}

// Main translation function
async function translateText(text, sourceLang = null, targetLang = null, skipCache = false) {
    try {
        const translation = await translateWithDoubao(text, sourceLang, targetLang, skipCache);
        
        // Generate pinyin if translating to Chinese
        const detectedSourceLang = sourceLang || detectLanguage(text);
        const detectedTargetLang = targetLang || (detectedSourceLang === 'zh' ? 'id' : 'zh');
        
        let pinyin = '';
        if (detectedTargetLang === 'zh') {
            pinyin = generatePinyin(translation);
        }
        
        return { chinese: detectedTargetLang === 'zh' ? translation : text, pinyin: pinyin, translation: translation };
    } catch (error) {
        console.error('Translation failed:', error);
        showNotification(isChinese ? '翻译失败，请检查API配置。' : 'Terjemahan gagal, periksa konfigurasi API.');
        return { chinese: '', pinyin: '', translation: '' };
    }
}

// Indonesian to Chinese translation function
async function translateIndonesianToChinese(indonesianText, isSentence = false, skipCache = true) {
    try {
        const result = await translateText(indonesianText, 'id', 'zh', skipCache);
        return { chinese: result.translation, pinyin: result.pinyin };
    } catch (error) {
        console.error('Indonesian to Chinese translation failed:', error);
        return { chinese: '', pinyin: '' };
    }
}

// Chinese to Indonesian translation function
async function translateChineseToIndonesian(chineseText, skipCache = true) {
    try {
        const result = await translateText(chineseText, 'zh', 'id', skipCache);
        return result.translation;
    } catch (error) {
        console.error('Chinese to Indonesian translation failed:', error);
        return '';
    }
}

// Enhanced sentence translation function
async function translateSentence(sentence) {
    try {
        // 直接使用翻译API翻译整个句子，不再使用本地词典
        const result = await translateIndonesianToChinese(sentence, true);
        return {
            chinese: result.chinese,
            pinyin: result.pinyin
        };
    } catch (error) {
        console.error('句子翻译失败:', error);
        // 如果API调用失败，返回空结果
        return {
            chinese: '',
            pinyin: ''
        };
    }
}

// Enhanced single word translation using API
async function translateWord(word) {
    try {
        // 直接使用翻译API进行单词翻译，不再使用本地词典
        const result = await translateIndonesianToChinese(word, false);
        return result;
    } catch (error) {
        console.error('单词翻译失败:', error);
        // 如果API调用失败，返回空结果
        return {
            chinese: '',
            pinyin: ''
        };
    }
}

// Function to find the best matching word based on similarity
function findBestWordMatch(inputWord) {
    let bestMatch = null;
    let highestScore = 0;
    
    // Check each word in the dictionary
    for (const dictWord in indoToChineseDict) {
        // Calculate similarity score between input word and dictionary word
        const score = calculateWordSimilarity(inputWord, dictWord);
        
        // If this is a good match (score > 0.6), consider it
        if (score > 0.6 && score > highestScore) {
            highestScore = score;
            bestMatch = indoToChineseDict[dictWord];
        }
    }
    
    return bestMatch;
}

// Calculate similarity between two words (simple implementation)
function calculateWordSimilarity(word1, word2) {
    // If one word is a substring of another
    if (word1.includes(word2) || word2.includes(word1)) {
        return 0.8;
    }
    
    // Check for common prefixes (Indonesian often uses prefixes like "me-", "di-", etc.)
    const commonPrefixes = ['me', 'di', 'pe', 'ter', 'ke', 'se', 'ber', 'per'];
    for (const prefix of commonPrefixes) {
        if (word1.startsWith(prefix) && word2 === word1.substring(prefix.length)) {
            return 0.7;
        }
        if (word2.startsWith(prefix) && word1 === word2.substring(prefix.length)) {
            return 0.7;
        }
    }
    
    // Check for common suffixes
    const commonSuffixes = ['kan', 'an', 'i'];
    for (const suffix of commonSuffixes) {
        if (word1.endsWith(suffix) && word2 === word1.substring(0, word1.length - suffix.length)) {
            return 0.7;
        }
        if (word2.endsWith(suffix) && word1 === word2.substring(0, word2.length - suffix.length)) {
            return 0.7;
        }
    }
    
    // Calculate Levenshtein distance for basic similarity check
    const distance = levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    const similarity = 1 - (distance / maxLength);
    
    return similarity;
}

// Simple Levenshtein distance implementation
function levenshteinDistance(a, b) {
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1, // substitution
                    matrix[i][j-1] + 1,     // insertion
                    matrix[i-1][j] + 1      // deletion
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

// Function to infer translation based on Indonesian word structure
function inferFromWordStructure(word) {
    // Common Indonesian word patterns and their likely Chinese translations
    const patternTranslations = {
        // Numbers
        'satu': { chinese: '一', pinyin: 'yī' },
        'dua': { chinese: '二', pinyin: 'èr' },
        'tiga': { chinese: '三', pinyin: 'sān' },
        'empat': { chinese: '四', pinyin: 'sì' },
        'lima': { chinese: '五', pinyin: 'wǔ' },
        'enam': { chinese: '六', pinyin: 'liù' },
        'tujuh': { chinese: '七', pinyin: 'qī' },
        'delapan': { chinese: '八', pinyin: 'bā' },
        'sembilan': { chinese: '九', pinyin: 'jiǔ' },
        'sepuluh': { chinese: '十', pinyin: 'shí' },
        
        // Common adjectives with prefixes
        'baik': { chinese: '好', pinyin: 'hǎo' },
        'buruk': { chinese: '坏', pinyin: 'huài' },
        'besar': { chinese: '大', pinyin: 'dà' },
        'kecil': { chinese: '小', pinyin: 'xiǎo' },
        'panjang': { chinese: '长', pinyin: 'cháng' },
        'pendek': { chinese: '短', pinyin: 'duǎn' },
        'baru': { chinese: '新', pinyin: 'xīn' },
        'lama': { chinese: '旧', pinyin: 'jiù' },
    };
    
    // Check if the word or its root exists in our pattern translations
    for (const pattern in patternTranslations) {
        // Check for exact match
        if (word === pattern) {
            return patternTranslations[pattern];
        }
        
        // Check for words with prefixes/suffixes
        if (word.includes(pattern) && word.length > pattern.length) {
            // For example, "membaik" might be related to "baik"
            const baseTranslation = patternTranslations[pattern];
            // Add appropriate verb/noun markers for derived words
            if (word.startsWith('me') || word.startsWith('mem')) {
                // Likely a verb form
                return {
                    chinese: baseTranslation.chinese + '（做）',
                    pinyin: baseTranslation.pinyin + ' (zuò)'
                };
            } else if (word.endsWith('an')) {
                // Likely a noun form
                return {
                    chinese: baseTranslation.chinese + '（名词）',
                    pinyin: baseTranslation.pinyin + ' (míngcí)'
                };
            }
        }
    }
    
    return null;
}

// Modal Functionality for Adding and Editing Words and Sentences
function initModals() {
    // Word Modal
    const addMoreWords = document.getElementById('addMoreWords');
    const wordModal = document.getElementById('wordModal');
    const closeWordModal = document.getElementById('closeWordModal');
    const cancelWordModal = document.getElementById('cancelWordModal');
    const wordForm = document.getElementById('wordForm');
    const wordModalTitle = document.querySelector('#wordModal h3');
    const wordSubmitBtn = wordForm.querySelector('button[type="submit"]');
    const chineseWordInput = document.getElementById('chineseWord');
    const wordPinyinInput = document.getElementById('wordPinyin');
    const indonesianWordInput = document.getElementById('indonesianWord');
    
    // Sentence Modal
    const addMoreSentences = document.getElementById('addMoreSentences');
    const sentenceModal = document.getElementById('sentenceModal');
    const closeSentenceModal = document.getElementById('closeSentenceModal');
    const cancelSentenceModal = document.getElementById('cancelSentenceModal');
    const sentenceForm = document.getElementById('sentenceForm');
    const sentenceModalTitle = document.querySelector('#sentenceModal h3');
    const sentenceSubmitBtn = sentenceForm.querySelector('button[type="submit"]');
    const chineseSentenceInput = document.getElementById('chineseSentence');
    const sentencePinyinInput = document.getElementById('sentencePinyin');
    const indonesianSentenceInput = document.getElementById('indonesianSentence');
    
    // Translation functionality will be set up when modal is opened via setupAutoTranslation function
    // This avoids duplicate event listeners and ensures fresh setup each time modal opens
    
    // Word Modal Events
    if (addMoreWords && wordModal) {
        addMoreWords.addEventListener('click', () => {
            // Set as new word mode
            currentEditingId = null;
            currentEditingType = 'word';
            
            // Update modal appearance for adding
            if (wordModalTitle) wordModalTitle.textContent = isChinese ? '添加新词语' : 'Tambah Kata Baru';
            if (wordSubmitBtn) wordSubmitBtn.textContent = isChinese ? '添加词语' : 'Tambah Kata';
            
            // Show modal
            wordModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Reset form
            if (wordForm) wordForm.reset();
            
            // Setup automatic translation for Indonesian input
            setupAutoTranslation('word');
        });
    }
    
    function closeWordModalFunc() {
        if (wordModal) {
            wordModal.classList.add('hidden');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
        if (wordForm) {
            wordForm.reset();
        }
    }
    
    if (closeWordModal) closeWordModal.addEventListener('click', closeWordModalFunc);
    if (cancelWordModal) cancelWordModal.addEventListener('click', closeWordModalFunc);
    
    if (wordForm) {
        wordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values by ID for better reliability
            const chineseWord = document.getElementById('chineseWord').value;
            const pinyin = document.getElementById('wordPinyin').value;
            const indonesian = document.getElementById('indonesianWord').value;
            
            if (chineseWord && pinyin && indonesian) {
                if (currentEditingId) {
                    // Update existing word
                    updateWord(currentEditingId, chineseWord, pinyin, indonesian);
                    
                    // Also update in user translations dictionary
                    addUserTranslation(indonesian, chineseWord, pinyin);
                    
                    showNotification(isChinese ? '词语已更新并保存到词典！' : 'Kata telah diperbarui dan disimpan!');
                } else {
                    // Add new word
                    addNewWord(chineseWord, pinyin, indonesian);
                    
                    // Also add to user translations dictionary for future use
                    addUserTranslation(indonesian, chineseWord, pinyin);
                    
                    showNotification(isChinese ? '新词语已添加并保存到词典！' : 'Kata baru telah ditambahkan dan disimpan!');
                }
                closeWordModalFunc();
            } else {
                showNotification(isChinese ? '请填写所有字段。' : 'Harap isi semua bidang.');
            }
        });
    }
    
    // Sentence Modal Events
    if (addMoreSentences && sentenceModal) {
        addMoreSentences.addEventListener('click', () => {
            // Set as new sentence mode
            currentEditingId = null;
            currentEditingType = 'sentence';
            
            // Update modal appearance for adding
            if (sentenceModalTitle) sentenceModalTitle.textContent = isChinese ? '添加新句子' : 'Tambah Kalimat Baru';
            if (sentenceSubmitBtn) sentenceSubmitBtn.textContent = isChinese ? '添加句子' : 'Tambah Kalimat';
            
            // Show modal
            sentenceModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Reset form
            if (sentenceForm) sentenceForm.reset();
            
            // Setup automatic translation for Indonesian input
            setupAutoTranslation('sentence');
        });
    }
    
    // Function to handle input events with auto-translation and debounce
    function setupAutoTranslation(type) {
        if (type === 'word') {
            const indonesianInput = document.getElementById('indonesianWord');
            const chineseInput = document.getElementById('chineseWord');
            const pinyinInput = document.getElementById('wordPinyin');
            
            if (indonesianInput && chineseInput && pinyinInput) {
                // Clear previous event listeners for all inputs
                const newIndonesianInput = indonesianInput.cloneNode(true);
                const newChineseInput = chineseInput.cloneNode(true);
                indonesianInput.parentNode.replaceChild(newIndonesianInput, indonesianInput);
                chineseInput.parentNode.replaceChild(newChineseInput, chineseInput);
                
                let wordInputTimeout = null;
                
                // 1. Chinese to Indonesian translation
                newChineseInput.addEventListener('input', () => {
                    clearTimeout(wordInputTimeout);
                    const chineseText = newChineseInput.value.trim();
                    
                    if (chineseText) {
                        // Generate pinyin automatically
                        const pinyin = generatePinyin(chineseText);
                        pinyinInput.value = pinyin;
                        
                        // Translate to Indonesian with debounce
                        wordInputTimeout = setTimeout(async () => {
                            try {
                                // Try dictionary first
                                let indonesian = '';
                                for (const [key, value] of Object.entries(indoToChineseDict)) {
                                    if (value.chinese === chineseText) {
                                        indonesian = key;
                                        break;
                                    }
                                }
                                
                                // If not in dictionary, use API
                                if (!indonesian && checkApiConfig()) {
                                    const translation = await translateChineseToIndonesian(chineseText);
                                    if (translation) {
                                    // 清除并更新印尼语输入框，确保重新输入时能获得新的翻译结果
                                    newIndonesianInput.value = translation;
                                }
                                } else if (indonesian) {
                                    // 清除并更新印尼语输入框，确保重新输入时能获得新的翻译结果
                                    newIndonesianInput.value = indonesian;
                                }
                            } catch (error) {
                                console.log('Translation error (ignored):', error.message);
                            }
                        }, 500);
                    }
                });
                
                // 2. Indonesian to Chinese translation
                newIndonesianInput.addEventListener('input', () => {
                    clearTimeout(wordInputTimeout);
                    const indonesianText = newIndonesianInput.value.trim();
                    
                    // Only translate if there's text and API is configured
                    if (indonesianText && checkApiConfig()) {
                        wordInputTimeout = setTimeout(async () => {
                            try {
                                // 直接使用翻译API，不再检查本地词典
                                const result = await translateIndonesianToChinese(indonesianText);
                                
                                if (result && result.chinese) {
                                    // Only update fields if they are empty or the user hasn't modified them
                                    // 清除并更新中文和拼音输入框，确保重新输入时能获得新的翻译结果
                                    newChineseInput.value = result.chinese;
                                    pinyinInput.value = result.pinyin || generatePinyin(result.chinese);
                                }
                            } catch (error) {
                                console.log('Translation error (ignored):', error.message);
                            }
                        }, 500); // 500ms debounce
                    }
                });
            }
        } else if (type === 'sentence') {
            const indonesianInput = document.getElementById('indonesianSentence');
            const chineseInput = document.getElementById('chineseSentence');
            const pinyinInput = document.getElementById('sentencePinyin');
            
            if (indonesianInput && chineseInput && pinyinInput) {
                // Clear previous event listeners for all inputs
                const newIndonesianInput = indonesianInput.cloneNode(true);
                const newChineseInput = chineseInput.cloneNode(true);
                indonesianInput.parentNode.replaceChild(newIndonesianInput, indonesianInput);
                chineseInput.parentNode.replaceChild(newChineseInput, chineseInput);
                
                let sentenceInputTimeout = null;
                
                // 1. Chinese to Indonesian translation
                newChineseInput.addEventListener('input', () => {
                    clearTimeout(sentenceInputTimeout);
                    const chineseText = newChineseInput.value.trim();
                    
                    if (chineseText) {
                        // Generate pinyin automatically
                        const pinyin = generatePinyin(chineseText);
                        pinyinInput.value = pinyin;
                        
                        // Translate to Indonesian with debounce
                        sentenceInputTimeout = setTimeout(async () => {
                            try {
                                if (checkApiConfig()) {
                                    const translation = await translateChineseToIndonesian(chineseText);
                                    if (translation) {
                                        // 清除并更新印尼语输入框，确保重新输入时能获得新的翻译结果
                                        newIndonesianInput.value = translation;
                                    }
                                }
                            } catch (error) {
                                console.log('Translation error (ignored):', error.message);
                            }
                        }, 800);
                    }
                });
                
                // 2. Indonesian to Chinese translation
                newIndonesianInput.addEventListener('input', () => {
                    clearTimeout(sentenceInputTimeout);
                    const indonesianText = newIndonesianInput.value.trim();
                    
                    // Only translate if there's text and API is configured
                    if (indonesianText && checkApiConfig()) {
                        sentenceInputTimeout = setTimeout(async () => {
                            try {
                                // Try to translate the sentence
                                const result = await translateIndonesianToChinese(indonesianText);
                                
                                if (result && result.chinese) {
                                    // Only update fields if they are empty or the user hasn't modified them
                                    // 清除并更新中文和拼音输入框，确保重新输入时能获得新的翻译结果
                                    newChineseInput.value = result.chinese;
                                    pinyinInput.value = result.pinyin || generatePinyin(result.chinese);
                                }
                            } catch (error) {
                                console.log('Translation error (ignored):', error.message);
                            }
                        }, 800); // 800ms debounce for sentences
                    }
                });
            }
        }
    }
    
    function closeSentenceModalFunc() {
        if (sentenceModal) {
            sentenceModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        if (sentenceForm) {
            sentenceForm.reset();
        }
    }
    
    if (closeSentenceModal) closeSentenceModal.addEventListener('click', closeSentenceModalFunc);
    if (cancelSentenceModal) cancelSentenceModal.addEventListener('click', closeSentenceModalFunc);
    
    if (sentenceForm) {
        sentenceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values by ID for better reliability
            const chineseSentence = document.getElementById('chineseSentence').value;
            const pinyin = document.getElementById('sentencePinyin').value;
            const indonesian = document.getElementById('indonesianSentence').value;
            
            if (chineseSentence && pinyin && indonesian) {
                if (currentEditingId) {
                    // Update existing sentence
                    updateSentence(currentEditingId, chineseSentence, pinyin, indonesian);
                    
                    // Also update in user translations dictionary
                    addUserTranslation(indonesian, chineseSentence, pinyin);
                    
                    showNotification(isChinese ? '句子已更新并保存到词典！' : 'Kalimat telah diperbarui dan disimpan!');
                } else {
                    // Add new sentence
                    addNewSentence(chineseSentence, pinyin, indonesian);
                    
                    // Also add to user translations dictionary for future use
                    addUserTranslation(indonesian, chineseSentence, pinyin);
                    
                    showNotification(isChinese ? '新句子已添加并保存到词典！' : 'Kalimat baru telah ditambahkan dan disimpan!');
                }
                closeSentenceModalFunc();
            } else {
                showNotification(isChinese ? '请填写所有字段。' : 'Harap isi semua bidang.');
            }
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === wordModal) closeWordModalFunc();
        if (e.target === sentenceModal) closeSentenceModalFunc();
    });
}

// Add IDs to existing sticky notes only (no edit buttons)
function addEditButtonsToExistingNotes() {
    // Add IDs to existing notes if they don't have any
    const wordNotes = document.querySelectorAll('#words .sticky-note');
    const sentenceNotes = document.querySelectorAll('#sentences .sticky-note');
    
    wordNotes.forEach((note, index) => {
        if (!note.id) {
            note.id = `word-note-${index}`;
        }
    });
    
    sentenceNotes.forEach((note, index) => {
        if (!note.id) {
            note.id = `sentence-note-${index}`;
        }
    });
}

// This function has been removed as edit buttons are no longer needed
// function addEditButton(noteElement, noteType) {}

// Open edit modal with existing data
function openEditModal(noteId, noteType) {
    const noteElement = document.getElementById(noteId);
    if (!noteElement) return;
    
    // Store current editing info
    currentEditingId = noteId;
    currentEditingType = noteType;
    
    // Get existing content
    const chineseText = noteElement.querySelector('h3').textContent;
    const pinyinText = noteElement.querySelector('.text-lg.font-bubblegum').textContent;
    const indonesianText = noteElement.querySelectorAll('p')[1].textContent;
    
    if (noteType === 'word') {
        // Open word modal
        const wordModal = document.getElementById('wordModal');
        const wordModalTitle = document.querySelector('#wordModal h3');
        const wordSubmitBtn = document.querySelector('#wordForm button[type="submit"]');
        const wordFormInputs = document.querySelectorAll('#wordForm input');
        
        if (wordModal) {
            // Update modal appearance for editing
            if (wordModalTitle) wordModalTitle.textContent = isChinese ? '编辑词语' : 'Edit Kata';
            if (wordSubmitBtn) wordSubmitBtn.textContent = isChinese ? '更新词语' : 'Perbarui Kata';
            
            // Fill form with existing data
            if (wordFormInputs.length >= 3) {
                wordFormInputs[0].value = chineseText;
                wordFormInputs[1].value = pinyinText;
                // Remove any newline characters before setting the input value
                wordFormInputs[2].value = indonesianText.replace(/\n/g, ' ');
            }
            
            // Show modal
            wordModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    } else if (noteType === 'sentence') {
        // Open sentence modal
        const sentenceModal = document.getElementById('sentenceModal');
        const sentenceModalTitle = document.querySelector('#sentenceModal h3');
        const sentenceSubmitBtn = document.querySelector('#sentenceForm button[type="submit"]');
        const sentenceFormInputs = document.querySelectorAll('#sentenceForm input');
        
        if (sentenceModal) {
            // Update modal appearance for editing
            if (sentenceModalTitle) sentenceModalTitle.textContent = isChinese ? '编辑句子' : 'Edit Kalimat';
            if (sentenceSubmitBtn) sentenceSubmitBtn.textContent = isChinese ? '更新句子' : 'Perbarui Kalimat';
            
            // Fill form with existing data
            if (sentenceFormInputs.length >= 3) {
                sentenceFormInputs[0].value = chineseText;
                sentenceFormInputs[1].value = pinyinText;
                // Remove any newline characters before setting the input value
                sentenceFormInputs[2].value = indonesianText.replace(/\n/g, ' ');
            }
            
            // Show modal
            sentenceModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Delete sticky note function
function deleteStickyNote(noteId, noteType) {
    const noteElement = document.getElementById(noteId);
    if (!noteElement) return;
    
    // Add deletion animation
    noteElement.style.transition = 'all 0.3s ease';
    noteElement.style.opacity = '0';
    noteElement.style.transform = 'scale(0.9) rotate(0deg)';
    
    // Remove the element after animation completes
    setTimeout(() => {
        noteElement.remove();
        showNotification(isChinese ? '便利贴已删除！' : 'Catatan telah dihapus!');
        
        // Save updated visual elements to localStorage after deletion
        saveUserAddedVisualElements();
    }, 300);
}

// Add New Word to the Collection
function addNewWord(chineseWord, pinyin, indonesian) {
    // Get the words grid
    const wordsGrid = document.querySelector('#words .grid');
    if (!wordsGrid) return;
    
    // Generate random rotation for sticky note effect
    const rotation = (Math.random() * 2 - 1).toFixed(1);
    
    // Create new sticky note element
    const colors = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-orange-100'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Generate unique ID
    const uniqueId = `word-note-${Date.now()}`;
    
    const newWordElement = document.createElement('div');
    newWordElement.id = uniqueId;
    newWordElement.className = `sticky-note ${randomColor} p-5 rounded`;
    newWordElement.style.setProperty('--rotation', `${rotation}deg`);
    
    newWordElement.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <h3 class="text-2xl font-chinese text-dark">${chineseWord}</h3>
            <div class="flex gap-2">
                <button class="delete-btn bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full">
                    <i class="fa fa-trash"></i>
                </button>
                <button class="audio-btn bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-full">
                    <i class="fa fa-volume-up"></i>
                </button>
            </div>
        </div>
        <p class="text-lg font-bubblegum text-dark">${pinyin}</p>
        <p class="text-dark mt-2">${indonesian}</p>
        <div class="mt-3 pt-3 border-t border-${randomColor.replace('bg-', 'border-')}">
            <span class="inline-block bg-primary/10 text-primary text-sm px-2 py-1 rounded">Custom</span>
        </div>
    `;
    
    // Add event listener to the new audio button
    const audioButton = newWordElement.querySelector('.audio-btn');
    audioButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        speakText(chineseWord, 'zh-CN');
        audioButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        setTimeout(() => {
            audioButton.innerHTML = '<i class="fa fa-volume-up"></i>';
        }, 1500);
    });
    
    // Add event listener to the delete button
    const deleteButton = newWordElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteStickyNote(uniqueId, 'word');
    });
    
    // Add the new word to the grid
    wordsGrid.appendChild(newWordElement);
    
    // Save updated visual elements to localStorage
    saveUserAddedVisualElements();
}

// Update existing word
function updateWord(noteId, chineseWord, pinyin, indonesian) {
    const noteElement = document.getElementById(noteId);
    if (!noteElement) return;
    
    // Update content
    const h3 = noteElement.querySelector('h3');
    const pinyinElement = noteElement.querySelector('.text-lg.font-bubblegum');
    const indonesianElement = noteElement.querySelectorAll('p')[1];
    
    if (h3) h3.textContent = chineseWord;
    if (pinyinElement) pinyinElement.textContent = pinyin;
    if (indonesianElement) indonesianElement.textContent = indonesian;
    
    // Update audio button functionality
    const audioButton = noteElement.querySelector('.audio-btn');
    if (audioButton) {
        // Remove existing event listeners
        const newAudioButton = audioButton.cloneNode(true);
        audioButton.parentNode.replaceChild(newAudioButton, audioButton);
        
        // Add new event listener with updated text
        newAudioButton.addEventListener('click', () => {
            speakText(chineseWord, 'zh-CN');
            newAudioButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            setTimeout(() => {
                newAudioButton.innerHTML = '<i class="fa fa-volume-up"></i>';
            }, 1500);
        });
    }
    
    // Save updated visual elements to localStorage
    saveUserAddedVisualElements();
}

// Add New Sentence to the Collection
function addNewSentence(chineseSentence, pinyin, indonesian) {
    // Get the sentences grid
    const sentencesGrid = document.querySelector('#sentences .grid');
    if (!sentencesGrid) return;
    
    // Generate random rotation for sticky note effect
    const rotation = (Math.random() * 2 - 1).toFixed(1);
    
    // Create new sticky note element
    const colors = ['bg-red-100', 'bg-teal-100', 'bg-indigo-100', 'bg-amber-100'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Generate unique ID
    const uniqueId = `sentence-note-${Date.now()}`;
    
    const newSentenceElement = document.createElement('div');
    newSentenceElement.id = uniqueId;
    newSentenceElement.className = `sticky-note ${randomColor} p-6 rounded-lg`;
    newSentenceElement.style.setProperty('--rotation', `${rotation}deg`);
    
    newSentenceElement.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-chinese text-dark">${chineseSentence}</h3>
            <div class="flex gap-2">
                <button class="delete-btn bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full">
                    <i class="fa fa-trash"></i>
                </button>
                <button class="audio-btn bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-full">
                    <i class="fa fa-volume-up"></i>
                </button>
            </div>
        </div>
        <p class="text-lg font-bubblegum text-dark mb-2">${pinyin}</p>
        <p class="text-dark mb-4">${indonesian}</p>
        <div class="bg-white/50 p-3 rounded">
            <p class="text-dark italic">Custom sentence</p>
        </div>
    `;
    
    // Add event listener to the new audio button
    const audioButton = newSentenceElement.querySelector('.audio-btn');
    audioButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        speakText(chineseSentence, 'zh-CN');
        audioButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        setTimeout(() => {
            audioButton.innerHTML = '<i class="fa fa-volume-up"></i>';
        }, 1500);
    });
    
    // Add event listener to the delete button
    const deleteButton = newSentenceElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteStickyNote(uniqueId, 'sentence');
    });
    
    // Add the new sentence to the grid
    sentencesGrid.appendChild(newSentenceElement);
    
    // Save updated visual elements to localStorage
    saveUserAddedVisualElements();
}

// Update existing sentence
function updateSentence(noteId, chineseSentence, pinyin, indonesian) {
    const noteElement = document.getElementById(noteId);
    if (!noteElement) return;
    
    // Update content
    const h3 = noteElement.querySelector('h3');
    const pinyinElement = noteElement.querySelector('.text-lg.font-bubblegum');
    const indonesianElement = noteElement.querySelectorAll('p')[1];
    
    if (h3) h3.textContent = chineseSentence;
    if (pinyinElement) pinyinElement.textContent = pinyin;
    if (indonesianElement) indonesianElement.textContent = indonesian;
    
    // Update audio button functionality
    const audioButton = noteElement.querySelector('.audio-btn');
    if (audioButton) {
        // Remove existing event listeners
        const newAudioButton = audioButton.cloneNode(true);
        audioButton.parentNode.replaceChild(newAudioButton, audioButton);
        
        // Add new event listener with updated text
        newAudioButton.addEventListener('click', () => {
            speakText(chineseSentence, 'zh-CN');
            newAudioButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            setTimeout(() => {
                newAudioButton.innerHTML = '<i class="fa fa-volume-up"></i>';
            }, 1500);
        });
    }
    
    // Save updated visual elements to localStorage
    saveUserAddedVisualElements();
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    // Reset icon
                    if (mobileMenuBtn) {
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

// Sticky Notes Animation Effects
function initStickyNotes() {
    const stickyNotes = document.querySelectorAll('.sticky-note');
    
    stickyNotes.forEach((note, index) => {
        // Apply staggered animation delay
        note.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effect with random rotation
        note.addEventListener('mouseenter', () => {
            const randomRotation = (Math.random() * 2 - 1).toFixed(1);
            note.style.transform = `rotate(${randomRotation}deg) scale(1.03)`;
        });
        
        note.addEventListener('mouseleave', () => {
            const originalRotation = note.style.getPropertyValue('--rotation');
            note.style.transform = `rotate(${originalRotation}) scale(1)`;
        });
    });
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg transform translate-y-16 opacity-0 transition-all duration-300 z-50';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-y-16', 'opacity-0');
    }, 10);
    
    // Auto remove after delay
    setTimeout(() => {
        notification.classList.add('translate-y-16', 'opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Simple Analytics Function (for demonstration)
function initAnalytics() {
    // Track page views
    console.log('Page viewed at', new Date().toISOString());
    
    // Track button clicks
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.trim() || button.id;
            console.log('Button clicked:', action);
        });
    });
}

// 添加全局错误处理
window.addEventListener('error', function(error) {
    console.error('全局错误:', error.message, '在文件:', error.filename, '行号:', error.lineno);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise错误:', event.reason);
});

// 初始化函数，带错误处理
function safeInit() {
    console.log('开始初始化网站功能...');
    
    try {
        // 加载扩展词典
        try {
            if (window.extendedIndoToChineseDict) {
                extendedIndoToChineseDict = window.extendedIndoToChineseDict;
                mergeExtendedDictionary();
                console.log('扩展词典加载成功');
            }
        } catch (err) {
            console.error('扩展词典加载失败:', err);
        }
        
        // 加载用户翻译
        try {
            loadUserTranslations();
            console.log('用户翻译加载成功');
        } catch (err) {
            console.error('用户翻译加载失败:', err);
        }
        
        // 检查DOM元素是否存在
        const addMoreWordsBtn = document.getElementById('addMoreWords');
        const addMoreSentencesBtn = document.getElementById('addMoreSentences');
        
        console.log('按钮元素检查:', { addMoreWordsBtn: !!addMoreWordsBtn, addMoreSentencesBtn: !!addMoreSentencesBtn });
        
        // 初始化各个功能模块
        try {
            initMobileMenu();
            console.log('移动端菜单初始化成功');
        } catch (err) {
            console.error('移动端菜单初始化失败:', err);
        }
        
        try {
            initLanguageSwitch();
            console.log('语言切换功能初始化成功');
        } catch (err) {
            console.error('语言切换初始化失败:', err);
        }
        
        try {
            initModals();
            console.log('模态框功能初始化成功');
        } catch (err) {
            console.error('模态框初始化失败:', err);
        }
        
        try {
            initAudioPlayback();
            console.log('音频播放功能初始化成功');
        } catch (err) {
            console.error('音频播放初始化失败:', err);
        }
        
        try {
            initStickyNotes();
            console.log('便签功能初始化成功');
        } catch (err) {
            console.error('便签初始化失败:', err);
        }
        
        try {
            initSmoothScrolling();
            console.log('平滑滚动初始化成功');
        } catch (err) {
            console.error('平滑滚动初始化失败:', err);
        }
        
        try {
            initAnalytics();
            console.log('分析功能初始化成功');
        } catch (err) {
            console.error('分析初始化失败:', err);
        }
        
        try {
            addEditButtonsToExistingNotes();
            console.log('添加编辑按钮成功');
        } catch (err) {
            console.error('添加编辑按钮失败:', err);
        }
        
        try {
            restoreUserAddedVisualElements();
            console.log('恢复用户视觉元素成功');
        } catch (err) {
            console.error('恢复用户视觉元素失败:', err);
        }
        
        // 添加卸载事件监听器
        try {
            window.addEventListener('beforeunload', saveUserAddedVisualElements);
            console.log('卸载事件监听器添加成功');
        } catch (err) {
            console.error('添加卸载事件监听器失败:', err);
        }
        
        console.log('所有功能初始化完成');
        
    } catch (err) {
        console.error('初始化过程发生严重错误:', err);
        // 创建一个可见的错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translateX(-50%)';
        errorDiv.style.backgroundColor = 'red';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '15px';
        errorDiv.style.borderRadius = '5px';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = '网站功能初始化遇到问题，请刷新页面重试。';
        document.body.appendChild(errorDiv);
    }
}

// 确保在DOM完全加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    // DOM已经加载完成，直接执行
    safeInit();
}
