import Link from 'next/link';
import { Form } from '@/components/form';
import { redirect } from 'next/navigation';
import { createSender, getSender } from '@/use-cases/users.use-case';
import { Button } from '@/components/ui/button';
import { Role, Sender } from '@/types/core';
import { randomUUID } from 'crypto';
import { generateId } from '@/lib/id';

export default function Login() {
  async function register(formData: FormData) {
    'use server';
    console.log(process.env.POSTGRES_DATABASE_URL);

    let sender : Sender = {
      id: generateId(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      role: Role.USER,
    };

    let users = await getSender(sender.email);
    if (users.length > 0) {
      return 'User already exists'; // TODO: Handle errors with useFormStatus
    } else {
      await createSender(sender);
      redirect('/login');
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <Form action={register}>
          <Button>Sign Up</Button>
          <p className="text-center text-sm text-gray-600">
            {'Already have an account? '}
            <Link href="/login" className="font-semibold text-gray-800">
              Sign in
            </Link>
            {' instead.'}
          </p>
        </Form>
      </div>
    </div>
  );
}
