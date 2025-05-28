"use client"

import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AdPerformancePrediction() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ad Performance Prediction</h1>
        <p className="text-gray-600">Predict the performance of your ads before launching.</p>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="adCreative">Ad Creative</Label>
            <Input id="adCreative" placeholder="e.g., Ad Creative URL" />
          </div>
          <Button>Predict Ad Performance</Button>
        </div>
      </Card>
    </Layout>
  )
}
