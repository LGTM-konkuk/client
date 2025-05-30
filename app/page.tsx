import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className='bg-background w-full flex flex-col items-center'>
      {/* Hero section */}
      <section className='container py-24 sm:py-32'>
        <div className='mx-auto max-w-2xl text-center'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
            코드 리뷰로 성장하는 개발자
          </h1>
          <p className='mt-6 text-lg leading-8 text-muted-foreground'>
            경험 많은 개발자들의 코드 리뷰를 통해 실력을 키우고, 커리어를
            발전시키세요. 멘토링을 통해 더 나은 개발자가 되어보세요.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button asChild size='lg'>
              <Link href='/register'>시작하기</Link>
            </Button>
            <Button variant='link' asChild>
              <Link href='/about'>
                더 알아보기 <span aria-hidden='true'>→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section className='container py-24 sm:py-32'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-base font-semibold text-primary'>더 빠른 성장</h2>
          <p className='mt-2 text-3xl font-bold tracking-tight sm:text-4xl'>
            코드 리뷰의 모든 것
          </p>
          <p className='mt-6 text-lg leading-8 text-muted-foreground'>
            실무에서 검증된 개발자들의 피드백을 받아보세요. 코드 품질을 높이고
            더 나은 개발자가 되어보세요.
          </p>
        </div>

        <div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mt-24 lg:max-w-none lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>실무 중심의 피드백</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                실제 프로젝트에서 검증된 개발자들의 실무 중심 피드백을
                받아보세요.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>맞춤형 멘토링</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                당신의 수준과 목표에 맞는 맞춤형 멘토링을 제공합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>지속적인 성장</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                정기적인 코드 리뷰를 통해 지속적으로 성장할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
