import { CheckCircle, Package, ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto mb-4 w-12 h-12 text-green-600 dark:text-green-400" />
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Confirmed!
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Your order is confirmed and being processed.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Order Status */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-300">Order Confirmed</h3>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Confirmation email with tracking details coming soon.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                <Home className="w-4 h-4 mr-1" />
                Shop More
              </Button>
            </Link>
            <Link href="/categories/all_product" className="flex-1">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-sm">
                <ArrowRight className="w-4 h-4 mr-1" />
                View Products
              </Button>
            </Link>
          </div>

          {/* Support */}
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            Need help? Contact{" "}
            <a href="mailto:support@nicheclub.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@abcd.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}