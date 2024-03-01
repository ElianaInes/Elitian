# Generated by Django 5.0.1 on 2024-02-25 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0006_productos_ofrecido'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productos',
            name='descuento',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='productos',
            name='precio_oferta',
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
        ),
    ]