import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/group_provider.dart';

class CalendarioScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Calendario Screen'),
      ),
      body: FutureBuilder(
        future: Provider.of<GroupProvider>(context, listen: false).fetchGroups(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            print('Error in FutureBuilder: ${snapshot.error}');
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            return Consumer<GroupProvider>(
              builder: (context, groupProvider, child) {
                return ListView.builder(
                  itemCount: groupProvider.groups.length,
                  itemBuilder: (context, index) {
                    final group = groupProvider.groups[index];
                    return ListTile(
                      title: Text(group.name),
                      subtitle: Text(group.description ?? 'No description'),
                    );
                  },
                );
              },
            );
          }
        },
      ),
    );
  }
}
