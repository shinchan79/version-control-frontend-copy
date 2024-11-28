import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export function VersionHistorySkeleton() {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                >
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((buttonIndex) => (
                      <div
                        key={buttonIndex}
                        className="h-8 w-20 bg-gray-200 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }