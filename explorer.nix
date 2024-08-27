{ ... }: {
  perSystem = { pkgs, self', system, ... }: {
    packages = {
      explorer =
      let
        offlineCache = pkgs.fetchYarnDeps {
          yarnLock = ./yarn.lock;
          hash = "sha256-Hrru2qmsYUdrrWQ08F86BpQG84iCrNbVXomVTecvru8=";
        };
      in
      pkgs.stdenv.mkDerivation {
        pname = "pingpub-explorer";
        version = "0.1.0";
        src = ./.;

        nativeBuildInputs = with pkgs; [
          fixup-yarn-lock
          nodejs
          tree
          nodePackages.npm
          nodePackages.yarn
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
