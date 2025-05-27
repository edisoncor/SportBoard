import 'package:flutter/material.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/ui/screens/home/news/news_screen.dart'; // Importar NewsScreen

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return const DefaultTabController(
      length: 2, // Cambiado a 2 pestañas
      child: Scaffold(
        body: Column(
          children: [
            TabBar(
              labelColor: AppColors.primaryColor,
              unselectedLabelColor: AppColors.primaryColorLight,
              indicatorColor: AppColors.primaryColorDark,
              tabs: [
                Tab(text: 'Mis competencias'),
                Tab(text: 'Noticias'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  Center(child: Text('Eventos Tab')),
                  NewsScreen(), // Reemplazar con NewsScreen
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
