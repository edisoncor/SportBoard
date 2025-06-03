/// Model class representing a group entity.
class Group {
  /// Unique code identifying the group.
  final String code;
  /// List of child groups, if any.
  final List<Group>? children;
  /// Description of the group.
  final String? description;
  /// Indicates if the group is active.
  final bool isActive;
  /// Name of the group.
  final String name;
  /// Code of the parent group, if any.
  final String? parentCode;
  /// Version number of the group.
  final int version;

  /// Constructs a [Group] instance.
  Group({
    required this.code,
    this.children,
    this.description,
    required this.isActive,
    required this.name,
    this.parentCode,
    required this.version,
  });

  /// Creates a [Group] instance from a JSON map.
  factory Group.fromJson(Map<String, dynamic> json) {
    return Group(
      code: json['code'],
      children: json['children'] != null
          ? (json['children'] as List).map((i) => Group.fromJson(i)).toList()
          : null,
      description: json['description'],
      isActive: json['isActive'],
      name: json['name'],
      parentCode: json['parentCode'],
      version: json['version'],
    );
  }

  /// Converts the [Group] instance to a JSON map.
  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'children': children?.map((i) => i.toJson()).toList(),
      'description': description,
      'isActive': isActive,
      'name': name,
      'parentCode': parentCode,
      'version': version,
    };
  }
}
