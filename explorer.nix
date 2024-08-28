{ ... }: {
  perSystem = { pkgs, self', system, ... }: {
    packages = {
      explorer =
      let
        offlineCache = pkgs.fetchYarnDeps {
          yarnLock = ./yarn.lock;
          hash = "sha256-EKGuNjbLXLcKdNk6FgQXXYzH0iyUOuRxoddRjFNBFQY=";
        };
      in
      pkgs.stdenv.mkDerivation {
        pname = "pingpub-explorer";
        version = "0.1.0";
        src = builtins.filterSource 
          (path: type: 
            type != "directory" || baseNameOf path != ".github") 
          (pkgs.lib.cleanSource ./.);

        nativeBuildInputs = with pkgs; [
          tree
          fixup-yarn-lock
          nodePackages_latest.yarn
          nodePackages_latest.nodejs
        ];

        configurePhase = ''
          runHook preConfigure

          export HOME=$(mktemp -d)

          yarn config --offline set yarn-offline-mirror "${offlineCache}"
          fixup-yarn-lock yarn.lock
          yarn install --offline --frozen-lockfile --ignore-platform --ignore-scripts --no-progress --non-interactive
          export PATH="$PATH:node_modules/vite/bin"

          patchShebangs node_modules/

          runHook postConfigure
        '';

        buildPhase = ''
          ./node_modules/vite/bin/vite.js build
        '';

        installPhase = ''
          mkdir -p $out
          mv dist/* $out/
        '';
      };
    };
  };
}
