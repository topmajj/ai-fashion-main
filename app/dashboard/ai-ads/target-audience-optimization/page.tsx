"use client"

import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function TargetAudienceOptimization() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Target Audience Optimization</h1>
        <p className="text-gray-600">Optimize your ad targeting for maximum reach.</p>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="campaign">Ad Campaign</Label>
            <Input id="campaign" placeholder="e.g., Summer Collection Launch" />
          </div>
          <Button>Optimize Target Audience</Button>
        </div>
      </Card>
    </Layout>
  )
}
