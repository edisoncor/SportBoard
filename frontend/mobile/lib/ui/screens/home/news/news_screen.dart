import 'package:flutter/material.dart';

class NewsScreen extends StatelessWidget {
  const NewsScreen({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ListView.builder(
        itemCount: 20,
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              title: Text('Noticia $index'),
              subtitle: Text('Descripción de la noticia $index'),
            ),
          );
        },
      ),
    );
  }
}
