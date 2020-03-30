cp public/index.html /tmp/index.html
cp public/index_prod.html public/index.html
npm run build
cp /tmp/index.html public/index.html
