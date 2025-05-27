import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: const <Widget>[
          DrawerHeader(
            decoration: BoxDecoration(
              color: AppColors.primaryColor,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundImage: NetworkImage('https://example.com/user_profile_image.png'),
                ),
                SizedBox(height: 10),
                Text(
                  'Nombre de Usuario',
                  style: TextStyle(
                    color: AppColors.onPrimaryColor,
                    fontSize: 18,
                  ),
                ),
                Text(
                  'usuario@example.com',
                  style: TextStyle(
                    color: AppColors.onPrimaryColor,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            title: Text('Item 1'),
          ),
          ListTile(
            title: Text('Item 2'),
          ),
        ],
      ),
    );
  }
}
