# Generated by Django 5.0.1 on 2024-02-02 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productos',
            name='stock_minimo',
        ),
        migrations.AddField(
            model_name='productos',
            name='cont_peso_neto',
            field=models.CharField(default=0, max_length=10),
        ),
    ]