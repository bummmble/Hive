export default function createFallback(server) {
  /** Handle 404 Errors
     * Note: If doing isomorphic rendering with something like
     * Universal Component it will handle 404 paths, but it is good
     * to have this backup for paths that are not handled by the universal
     * middleware
     */

  server.use((req, res) => {
    res.status(404).send('Sorry, that resource was not found');
  });

  // Handle all other errors
  // Note: All 4 params must be specified on the callback even if
  // they are not being used, otherwise this won't be called

  // eslint-disable-next-line no-unused-vars
  server.use((err, req, res, next) => {
    if (err) {
      console.log(err);
      console.log(err.stack);
    }

    res.status(500).send('Sorry, an unexpected error occurred');
  });
}
