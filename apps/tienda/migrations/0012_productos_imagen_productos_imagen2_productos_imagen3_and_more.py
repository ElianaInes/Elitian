# Generated by Django 5.0.1 on 2024-02-25 19:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0011_alter_productoimagen_imagen_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='productos',
            name='imagen',
            field=models.ImageField(null=True, upload_to='media/tienda_images/productos'),
        ),
        migrations.AddField(
            model_name='productos',
            name='imagen2',
            field=models.ImageField(blank=True, null=True, upload_to='media/tienda_images/productos'),
        ),
        migrations.AddField(
            model_name='productos',
            name='imagen3',
            field=models.ImageField(blank=True, null=True, upload_to='media/tienda_images/productos'),
        ),
        migrations.DeleteModel(
            name='ProductoImagen',
        ),
    ]