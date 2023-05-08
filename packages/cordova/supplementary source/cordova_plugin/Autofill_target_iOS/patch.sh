#!/bin/sh
PROJ="$1"
DIFFDIR="$2"

awk '{if ($0 == "/* End PBXBuildFile section */") system("cat \"'"$DIFFDIR/PBXBuildFile.txt"'\"")}; {print $0}' "$PROJ" \
|\
awk '{if ($0 == "/* End PBXContainerItemProxy section */") system("cat \"'"$DIFFDIR/PBXContainerItemProxy.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* Begin PBXFileReference section */") system("cat \"'"$DIFFDIR/PBXCopyFilesBuildPhaseSection.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* End PBXFileReference section */") system("cat \"'"$DIFFDIR/PBXFileReference.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* End PBXFrameworksBuildPhase section */") system("cat \"'"$DIFFDIR/PBXFrameworksBuildPhase.txt"'\"")}; {print $0}' \
|\
awk '{print $0}; {if (match($0, "/\\* Padloc\\.app \\*/,$") > 0) print "				63E4AB582A08DBFE00C29FAA /* Autofill.appex */,"}' \
|\
awk '{print $0}; {if (match($0, "/\\* Products \\*/,$") > 0) print "				63E4AB5B2A08DBFE00C29FAA /* Autofill */,"}' \
|\
awk '{print $0}; {if (match($0, "/\\* WebKit\\.framework \\*/,$") > 0) print "				63E4AB592A08DBFE00C29FAA /* AuthenticationServices.framework */,"}' \
|\
awk '{if ($0 == "/* End PBXGroup section */") system("cat \"'"$DIFFDIR/PBXGroup.txt"'\"")}; {print $0}' \
|\
awk '{print $0}; {if (match($0, "/\\* Copy www directory \\*/,$") > 0) print "				63E4AB692A08DBFE00C29FAA /* Embed Foundation Extensions */,"}' \
|\
awk '{print $0}; {if (match($0, "/\\* PBXTargetDependency \\*/,$") > 0) print "				63E4AB642A08DBFE00C29FAA /* PBXTargetDependency */,"}' \
|\
awk '{if ($0 == "/* End PBXNativeTarget section */") system("cat \"'"$DIFFDIR/PBXNativeTarget.txt"'\"")}; {print $0}' \
|\
awk '{print $0}; {if (match($0, "/\\* Padloc \\*/,$") > 0) print "				63E4AB572A08DBFD00C29FAA /* Autofill */,"}' \
|\
awk '{if ($0 == "/* End PBXResourcesBuildPhase section */") system("cat \"'"$DIFFDIR/PBXResourcesBuildPhase.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* End PBXSourcesBuildPhase section */") system("cat \"'"$DIFFDIR/PBXSourcesBuildPhase.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* End PBXTargetDependency section */") system("cat \"'"$DIFFDIR/PBXTargetDependency.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* Begin XCBuildConfiguration section */") system("cat \"'"$DIFFDIR/PBXVariantGroup.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* End XCBuildConfiguration section */") system("cat \"'"$DIFFDIR/XCBuildConfiguration.txt"'\"")}; {print $0}' \
|\
awk '{if ($0 == "/* End XCConfigurationList section */") system("cat \"'"$DIFFDIR/XCConfigurationList.txt"'\"")}; {print $0}' \
