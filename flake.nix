{
  description = "Build the Union ping-pub explorer";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@{ self, nixpkgs, flake-parts, ... }:
  flake-parts.lib.mkFlake { inherit inputs; } {
    systems = [ "x86_64-linux" "aarch64-linux" ];
    imports = [
      ./explorer.nix
    ];
    perSystem = { config, self', inputs', system, pkgs, lib, ... }: {
      _module.args = {
        inherit nixpkgs;

        pkgs = import nixpkgs {
          inherit system;
        };
      };

      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          tree
          direnv
          nodePackages_latest.yarn
          nodePackages_latest.nodejs
        ];
      };
    };
  };
  nixConfig = {
    extra-substituters = [ 
      "https://union.cachix.org"
      "https://cache.garnix.io"
    ];
    extra-trusted-public-keys = [ 
      "union.cachix.org-1:TV9o8jexzNVbM1VNBOq9fu8NK+hL6ZhOyOh0quATy+M="
      "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g=" 
    ];
    accept-flake-config = true;
  };
}
