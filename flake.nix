{
  description = "TanStack Start Solid Hono development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    actrun.url = "github:mizchi/actrun/v0.30.1";
  };

  outputs = { actrun, nixpkgs, ... }:
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
        in
        {
          default = pkgs.mkShell {
            packages = [
              actrun.packages.${system}.default
              pkgs.nodejs_26
              pkgs.pnpm
            ];
            shellHook = ''
              # Resolve project-local bins/modules for pnpm's global virtual store.
              export PATH="$PWD/node_modules/.bin:$PATH"
              export NODE_PATH="$PWD/node_modules"
              # Install dependencies only if node_modules/.pnpm/lock.yaml is older than pnpm-lock.yaml
              if [ ! -f node_modules/.pnpm/lock.yaml ] || [ pnpm-lock.yaml -nt node_modules/.pnpm/lock.yaml ]; then
                echo "Installing dependencies..."
                pnpm install --frozen-lockfile
              fi
            '';
          };
          ci = pkgs.mkShell {
            packages = [
              pkgs.nodejs_26
              pkgs.pnpm
              pkgs.rclone
            ];
          };
        });
    };
}
