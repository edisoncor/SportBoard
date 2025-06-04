import 'package:flutter/material.dart';

/// This class contains all the color constants used throughout the application.
class AppColors {
  /// The primary color used in the app (green shade).
  static const Color primaryColor = Color(0xFF4CAF50);
  /// A lighter variant of the primary color.
  static const Color primaryColorLight = Color(0xFFC8E6C9);
  /// A darker variant of the primary color.
  static const Color primaryColorDark = Color(0xFF388E3C);

  /// The secondary color used in the app (light green shade).
  static const Color secondaryColor = Color(0xFF8BC34A);
  /// A lighter variant of the secondary color.
  static const Color secondaryColorLight = Color(0xFFDCEDC8);
  /// A darker variant of the secondary color.
  static const Color secondaryColorDark = Color(0xFF689F38);

  /// The background color for screens and widgets.
  static const Color backgroundColor = Color(0xFFE8F5E9);
  /// The color used for surfaces such as cards and sheets.
  static const Color surfaceColor = Color(0xFFFFFFFF);
  /// The color used to indicate errors.
  static const Color errorColor = Color(0xFFD32F2F);

  /// The color for text/icons displayed on primary color.
  static const Color onPrimaryColor = Color(0xFFFFFFFF);
  /// The color for text/icons displayed on secondary color.
  static const Color onSecondaryColor = Color(0xFF000000);
  /// The color for text/icons displayed on background color.
  static const Color onBackgroundColor = Color(0xFF000000);
  /// The color for text/icons displayed on surface color.
  static const Color onSurfaceColor = Color(0xFF000000);
  /// The color for text/icons displayed on error color.
  static const Color onErrorColor = Color(0xFFFFFFFF);
}
