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
              pkgs.nodejs_24
              pkgs.pnpm
            ];
          };
          ci = pkgs.mkShell {
            packages = [
              pkgs.nodejs_24
              pkgs.pnpm
              pkgs.rclone
            ];
          };
        });
    };
}
