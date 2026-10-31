# Yandex Music playlist exporter

A small, standalone static app that exports a **public** Yandex Music playlist to JSON. It does not sign in to Yandex or change the source playlist. The downloaded file has the shape `{ "likes": [...] }`, with each track containing `id`, `title`, `artists`, `album`, `durationMs`, and `isrc`.

The Russian-language interface follows the dark-card, green-accent style of the companion music-migration project. After export it shows the track count and a scrollable list of tracks.

## Run locally

Open `index.html` in a browser, or serve this directory with any static file server. To fetch playlists from a browser, deploy the included Cloudflare Worker and enter its HTTPS URL in the form.

## Deploy the Cloudflare Worker

1. In the Cloudflare dashboard, create a Worker and paste the contents of `worker.js` into its editor, then deploy it.
2. Copy the Worker URL (for example, `https://playlist-proxy.example.workers.dev`) into the export form. The URL must be the Worker base URL, without a path, query, or fragment.
3. Keep the Worker public endpoint as deployed. It permits only `GET` and CORS preflight `OPTIONS` requests to `/users/{owner}/playlists/{kind}`, and always requests that exact path from `https://api.music.yandex.net`. It does not accept or forward authorization headers or arbitrary upstream URLs.

The Worker is intentionally limited to public playlist lookups. A public URL is not a guarantee that every playlist can be fetched; Yandex may restrict or change its API.

## Deploy the app with GitHub Pages

The included GitHub Actions workflow deploys the site automatically on every push to `main`. After the first successful run, open the repository's **Settings → Pages** to find the published URL. No build step or package installation is required.

## Import the export

After exporting, download `yandex-playlist.json`. In the `FkS-maniac/music-migrator-web` project, use its playlist JSON import/upload flow to select that file. The export's `likes` array and track fields are shaped for that importer; the exporter does not connect to or modify the importer project.
