import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/group_provider.dart';
import 'widgets/custom_drawer.dart';
import 'widgets/custom_bottom_navigation_bar.dart';
import 'widgets/custom_app_bar.dart';
import 'screens/home/home_screen.dart';
import 'screens/search/search_screen.dart';
import 'screens/calendar/calendario_screen.dart';
import 'screens/real_time/real_time_screen.dart';
import 'screens/notifications/notifications_screen.dart';
import 'screens/messages/messages_screen.dart';

class SportBoardInterface extends StatefulWidget {
  const SportBoardInterface({super.key});

  @override
  _SportBoardInterfaceState createState() => _SportBoardInterfaceState();
}

class _SportBoardInterfaceState extends State<SportBoardInterface> {
  int _selectedIndex = 0;

  static final List<Widget> _widgetOptions = <Widget>[
    HomeScreen(),
    SearchScreen(),
    ChangeNotifierProvider(
      create: (_) => GroupProvider(),
      child: CalendarioScreen(),
    ),
    TiempoRealScreen(),
    NotificacionesScreen(),
    MensajesScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'SportBoard'),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
      drawer: const CustomDrawer(),
    );
  }
}
