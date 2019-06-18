# Generated by Django 2.2.1 on 2019-06-18 14:10

from django.db import migrations, models
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('parts', '0049_auto_20190521_1714'),
        ('assemblies', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='assembly',
            name='assembly_number',
            field=models.CharField(blank=True, db_index=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='assemblydocument',
            name='assembly',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assembly_documents', to='assemblies.Assembly'),
        ),
        migrations.CreateModel(
            name='AssemblyPart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.TextField(blank=True)),
                ('order', models.CharField(blank=True, db_index=True, max_length=255)),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('parent', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='assemblies.AssemblyPart')),
                ('part', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assembly_parts', to='parts.Part')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
