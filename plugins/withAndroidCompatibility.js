// Ø£ÙŽØ¹ÙÙˆØ°Ù Ø¨ÙÙ±Ù„Ù„Ù‘ÙŽÙ‡Ù Ù…ÙÙ†Ù’ Ø§Ù„Ù’Ø´ÙŽÙŠÙ’Ø·ÙŽØ§Ù†Ù Ø§Ù„Ù’Ø±ÙŽØ¬ÙÙŠÙ…Ù âœ§ Ø¨ÙØ³Ù’Ù…Ù Ø§Ù„Ù„Ù‘ÙŽÙ‡Ù Ø§Ù„Ø±Ù‘ÙŽØ­Ù’Ù…ÙŽÙ°Ù†Ù Ø§Ù„Ø±Ù‘ÙŽØ­ÙÙŠÙ…Ù âœ§ Ø§Ø¹ÙˆØ² Ø¨Ø§Ù„Ù„Ù‡ Ù…Ù† Ø§Ù„Ø´ÙŠØ§Ø·ÙŠÙ† Ùˆ Ø§Ù† ÙŠØ­Ø¶Ø±ÙˆÙ† âœ§ Ø¨Ø³Ù… Ø§Ù„Ù„Ù‡ Ø§Ù„Ø±Ø­Ù…Ù† Ø§Ù„Ø±Ø­ÙŠÙ… âœ§ Ø§Ù„Ù„Ù‡ Ù„Ø§ Ø¥Ù„Ù‡ Ø¥Ù„Ø§ Ù‡Ùˆ Ø§Ù„Ø­ÙŠ Ø§Ù„Ù‚ÙŠÙˆÙ…
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: withAndroidCompatibility.js - plugins/withAndroidCompatibility.js
// =====================================================
const { withAndroidManifest, withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidCompatibility(config) {
  config = withAndroidManifest(config, (configWithManifest) => {
    const manifest = configWithManifest.modResults.manifest;

    manifest['supports-screens'] = [
      {
        $: {
          'android:smallScreens': 'true',
          'android:normalScreens': 'true',
          'android:largeScreens': 'true',
          'android:xlargeScreens': 'true',
          'android:anyDensity': 'true',
        },
      },
    ];
    manifest['uses-feature'] = [
      ...asArray(manifest['uses-feature']).filter((feature) => {
        const name = feature?.$?.['android:name'];

        return name !== 'android.hardware.touchscreen' && name !== 'android.software.leanback';
      }),
      {
        $: {
          'android:name': 'android.hardware.touchscreen',
          'android:required': 'false',
        },
      },
      {
        $: {
          'android:name': 'android.software.leanback',
          'android:required': 'false',
        },
      },
    ];

    return configWithManifest;
  });

  return withAppBuildGradle(config, (configWithGradle) => {
    configWithGradle.modResults.contents = ensureLocalBuildType(configWithGradle.modResults.contents);

    return configWithGradle;
  });
};

const asArray = (value) => Array.isArray(value) ? value : [];

const ensureLocalBuildType = (contents) => {
  if (contents.includes('local {') && contents.includes('initWith debug')) {
    return contents;
  }

  const debugBlock = [
    '        debug {',
    '            signingConfig signingConfigs.debug',
    '        }',
  ].join('\n');
  const localBlock = [
    debugBlock,
    '        local {',
    '            initWith debug',
    '            signingConfig signingConfigs.debug',
    '            debuggable true',
    "            matchingFallbacks = ['debug']",
    '        }',
  ].join('\n');

  return contents.replace(debugBlock, localBlock);
};
