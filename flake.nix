{
  description = "TanStack Start Solid Hono development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    multiverse.url = "github:fzakaria/nixpkgs-multiverse";
    actrun.url = "github:mizchi/actrun/v0.30.1";
  };

  outputs = { actrun, multiverse, nixpkgs, ... }:
    let
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-linux"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          pkgs-multiverse = multiverse.multiverse.${system}.versions;
        in
        {
          default = pkgs.mkShell {
            packages = [
              actrun.packages.${system}.default
              pkgs-multiverse.nodejs_26."26.8.1"
              pkgs-multiverse.pnpm_12."12.3.4"
            ];
            shellHook = ''
              # Resolve project-local bins/modules for pnpm's global virtual store.
              export PATH="$PWD/node_modules/.bin:$PATH"
              export NODE_PATH="$PWD/node_modules"
              # Install dependencies only if node_modules/.pnpm/lock.yaml is older than pnpm-lock.yaml
              if [ ! -f node_modules/.pnpm/lock.yaml ] || [ pnpm-lock.yaml -nt node_modules/.pnpm/lock.yaml ]; then
                echo "Installing dependencies..."
                pnpm install --frozen-lockfile && touch node_modules/.pnpm/lock.yaml
              fi
            '';
          };
          ci = pkgs.mkShell {
            packages = [
              pkgs-multiverse.nodejs_26."26.8.1"
              pkgs-multiverse.pnpm_12."12.3.4"
              pkgs.rclone
            ];
          };
        });
    };
}
