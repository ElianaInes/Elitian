# Generated by Django 5.0.1 on 2024-02-24 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0005_alter_categorias_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='productos',
            name='ofrecido',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
