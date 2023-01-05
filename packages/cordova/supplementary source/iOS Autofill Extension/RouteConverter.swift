//
//  RouteConverter.swift
//  Autofill Provider Extension
//
//  Created by Nay Min Ko on 04/01/2023.
//

import Foundation

struct RouteConverter {
    static var objcTrue = ObjCBool(true)
    static var objcFalse = ObjCBool(false)

    static let dist: String = {
        let dist = (Bundle.main.bundlePath as NSString).appendingPathComponent("dist")
        guard Self.directoryExists(path: dist) else {
            fatalError("No dist")
        }
        return dist
    }()

    static func routePath(path: String) -> String? {
        let lPath = localPath(with: path)
        if directoryExists(path: lPath) {
            // A directory requested, return index.html
            let index = localPath(with: (path as NSString).appendingPathComponent("index.html"))
            if nonDirectoryExists(path: index) {
                return index
            }
        } else if nonDirectoryExists(path: lPath) {
            // Direct file request
            return lPath
        } else if !((lPath as NSString).lastPathComponent as String).contains(".") {
            return localPath(with: ("/" as NSString).appendingPathComponent("index.html"))
        }
        return nil
    }

    private static func localPath(with path: String) -> String {
        return (dist as NSString).appendingPathComponent(path)
    }

    private static var isDirectory = ObjCBool(Bool())

    static func directoryExists(path: String) -> Bool {
        return FileManager.default.fileExists(atPath: path, isDirectory: &isDirectory) && isDirectory.boolValue
    }

    static func nonDirectoryExists(path: String) -> Bool {
        return FileManager.default.fileExists(atPath: path, isDirectory: &isDirectory) && !isDirectory.boolValue
    }
}

enum FileSystemError: Error {
    case noSuchFileOrDirectory
}
