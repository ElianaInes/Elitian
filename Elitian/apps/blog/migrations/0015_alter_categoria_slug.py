# Generated by Django 5.0.1 on 2024-02-23 05:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0014_alter_post_contenido'),
    ]

    operations = [
        migrations.AlterField(
            model_name='categoria',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]
