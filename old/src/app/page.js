// app/page.jsx or any server component
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/admin') // redirect immediately
}
