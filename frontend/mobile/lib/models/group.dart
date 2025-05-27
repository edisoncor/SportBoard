class Group {
  final String code;
  final List<Group>? children;
  final String? description;
  final bool isActive;
  final String name;
  final String? parentCode;
  final int version;

  Group({
    required this.code,
    this.children,
    this.description,
    required this.isActive,
    required this.name,
    this.parentCode,
    required this.version,
  });

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
