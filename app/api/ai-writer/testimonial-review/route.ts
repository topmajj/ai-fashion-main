import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { productName, productFeatures, customerExperience, userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const prompt = `Generate a testimonial review for the following product:
    Product Name: ${productName}
    Product Features: ${productFeatures}
    Customer Experience: ${customerExperience}
    
    The testimonial should be authentic, engaging, and highlight the key features and benefits of the product based on the customer's experience.`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const generatedTestimonial = response.choices[0].message.content

    const { data, error } = await supabase
      .from("testimonial_reviews")
      .insert({
        user_id: userId,
        product_name: productName,
        product_features: productFeatures,
        customer_experience: customerExperience,
        testimonial: generatedTestimonial,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ testimonial: generatedTestimonial, id: data[0].id })
  } catch (error) {
    console.error("Error generating testimonial:", error)
    return NextResponse.json({ error: "Failed to generate testimonial" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const pageSize = 5

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error, count } = await supabase
      .from("testimonial_reviews")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw error

    return NextResponse.json({ testimonials: data, total: count })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("testimonial_reviews").delete().match({ id, user_id: userId })

    if (error) throw error

    return NextResponse.json({ message: "Testimonial deleted successfully" })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
