# Supabase Storage Setup

Configuración de buckets de almacenamiento para assets del juego.

## Buckets

Se crean 4 buckets públicos para lectura:

- `fish` - Sprites de peces
- `tanks` - Sprites de tanques
- `decorations` - Sprites de decoraciones
- `avatars` - Avatares de jugadores

## Convenciones de nombres

- Fish: `fish-{id}.png`
- Tanks: `tank-{id}.png`
- Decorations: `decoration-{id}.png`
- Avatars: `avatar-{player_address}.png`

## Acceso

- **Lectura**: Público (accesible desde Unity client)
- **Escritura**: Solo usuarios autenticados

## URLs públicas

```
https://{supabase-url}/storage/v1/object/public/{bucket}/{filename}
```

Ejemplo:
```
https://momjlqhhapbaigjwociq.supabase.co/storage/v1/object/public/fish/fish-1.png
```

## Aplicar migración

```bash
npx supabase db push
```
