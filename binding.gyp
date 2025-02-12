{
    "targets": [
        {
            "target_name": "hasherprogpow",
            "sources": [
                "src/ethash/ethash.cpp",
                "src/ethash/primes.c",
                "src/ethash/progpow.cpp",
                "src/keccak/keccak.c",
                "src/keccak/keccakf800.c",
                "src/keccak/keccakf1600.c",
                "src/uint256.cpp",
                "src/utilstrencodings.cpp",
                "hasherprogpow.cc"
            ],
            "include_dirs": [
                ".",
                "src",
                "<!(node -e \"require('nan')\")"
            ],
            "cflags_cc": [
                "-std=c++17"
            ]
        }
    ]
}
