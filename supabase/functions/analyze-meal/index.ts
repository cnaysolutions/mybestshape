import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { photoBase64, mimeType, description, mealType, profile } = await req.json()
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const profileLine = profile
      ? `The user is a ${profile.age}-year-old ${profile.sex}, ${profile.weight_kg}kg, ${profile.height_cm}cm, activity level: ${profile.activity_level}, goal: ${profile.goal} weight.`
      : 'No profile info available.'

    const systemPrompt = `You are a supportive, practical nutrition coach inside the MyBestShape app, analyzing a single logged meal.
${profileLine}
Estimate the meal's nutrition and give one short, specific, practical tip tailored to this person's profile and goal.
Respond with ONLY raw JSON, no markdown fences, no extra text, in exactly this shape:
{"calories": number, "protein_g": number, "carbs_g": number, "fat_g": number, "quality_score": number (1-10), "comment": string (1-2 sentences, second person, practical)}`

    const userContent = []
    if (photoBase64 && mimeType) {
      userContent.push({ type: 'image', source: { type: 'base64', media_type: mimeType, data: photoBase64 } })
    }
    userContent.push({
      type: 'text',
      text: `Meal type: ${mealType || 'unspecified'}.${description ? ` Description: ${description}` : ' No text description, estimate from the photo alone.'}`,
    })

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      return new Response(JSON.stringify({ error: `Anthropic API error: ${errText}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const anthropicData = await anthropicRes.json()
    const rawText = anthropicData.content?.[0]?.text || '{}'
    const cleaned = rawText.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')
    const parsed = JSON.parse(cleaned)

    return new Response(JSON.stringify(parsed), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
