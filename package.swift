// swift-tools-version:5.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "AppStrings",
    platforms: [
        .iOS(.v11),
        .macOS(.v10_15)
    ],
    products: [
        .library(
            name: "AppStrings",
            targets: ["AppStrings"]),
    ],
    targets: [
        .target(
            name: "AppStrings",
            dependencies: [],
            path: "Sources")
    ]
)
