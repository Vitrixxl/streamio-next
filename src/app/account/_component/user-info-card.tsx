import { LucideSave } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { FormItem } from '~/components/form-item';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { User } from 'better-auth';
export const UserInfoCard = (user: User) => {
  return (
    <div className='flex flex-col gap-2 w-full col-span-2 h-full'>
      <Tabs defaultValue='info'>
        <TabsList className='w-full'>
          <TabsTrigger value='info' className='flex-1'>
            Informations
          </TabsTrigger>
          <TabsTrigger value='password' className='flex-1'>
            Mot de passe
          </TabsTrigger>
        </TabsList>
        <TabsContent value='info' className='flex-1'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>Compte</CardTitle>
              <CardDescription>
                Changer les informations de votre compte ici
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className='grid gap-2'>
                <FormItem label='Nom' id='name' defaultValue={user.name}>
                </FormItem>
                <Button className='w-fit mt-2'>
                  <LucideSave />Enregistrer
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='password'>
          <Card>
            <CardHeader>
              <CardTitle>Compte</CardTitle>
              <CardDescription>
                Changer les informations de votre compte ici
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className='grid gap-2'>
                <FormItem
                  label='Mot de passe'
                  id='psw'
                  type='password'
                >
                </FormItem>
                <FormItem
                  label='Nouveau mot de passe'
                  id='newPsw'
                  type='password'
                >
                </FormItem>
                <Button className='w-fit mt-2'>
                  <LucideSave />Enregistrer
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
