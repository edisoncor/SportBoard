import 'package:http/http.dart' as http;
import '../models/group.dart';
import '../core/utils/api_endpoints.dart';

/// Service class for handling group-related API operations.
class GroupService {
  /// Returns a list of example groups without querying the API.
  static Future<List<Group>> getGroups() async {
    // Datos de ejemplo para devolver sin consultar a la API
    List<Group> exampleGroups = [
      Group(
        code: '001',
        name: 'Group 1',
        isActive: true,
        version: 1,
        description: 'Description for Group 1',
      ),
      Group(
        code: '002',
        name: 'Group 2',
        isActive: true,
        version: 1,
        description: 'Description for Group 2',
      ),
      Group(
        code: '003',
        name: 'Group 3',
        isActive: true,
        version: 1,
        description: 'Description for Group 3',
      ),
      Group(
        code: '004',
        name: 'Group 4',
        isActive: true,
        version: 1,
        description: 'Description for Group 4',
      ),
      Group(
        code: '005',
        name: 'Group 5',
        isActive: true,
        version: 1,
        description: 'Description for Group 5',
      ),
    ];
    return Future.value(exampleGroups);
  }

  /// Checks if the groups endpoint is accessible by making a GET request.
  /// Returns true if the endpoint is reachable and returns status 200, otherwise false.
  static Future<bool> canAccessEndpoint() async {
    try {
      final response = await http.get(Uri.parse(ApiEndpoints.groups));
      return response.statusCode == 200;
    } catch (e) {
      print('Error accessing endpoint: $e');
      return false;
    }
  }
}
