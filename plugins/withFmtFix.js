const { withPodfile } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to fix C++20 compilation errors in the 'fmt' library.
 * It forces the 'fmt' pod target to use C++17 standard.
 */
const withFmtFix = (config) => {
  return withPodfile(config, (config) => {
    // Using installer.pods_project.targets which contains PBXNativeTarget objects
    const fixCode = `
    # [Start withFmtFix] Fix for fmt library C++20 compatibility
    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        end
      end
    end
    # [End withFmtFix]`;

    let contents = config.modResults.contents;
    
    if (contents.includes('# [Start withFmtFix]')) {
      const startTag = '# [Start withFmtFix]';
      const endTag = '# [End withFmtFix]';
      const startIndex = contents.indexOf(startTag);
      const endIndex = contents.indexOf(endTag) + endTag.length;
      
      if (startIndex !== -1 && endIndex !== -1) {
        contents = contents.slice(0, startIndex) + fixCode.trim() + contents.slice(endIndex);
      }
    } else {
      contents = contents.replace(
        /(react_native_post_install\(.+?\))/s,
        `$1\n${fixCode}`
      );
    }
    
    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withFmtFix;
