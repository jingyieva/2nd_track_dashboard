import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default {
  title: 'UI/Card',
  component: Card,
};

export const Basic = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Basic Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a simple card with some content inside.</p>
      </CardContent>
    </Card>
  ),
};

export const WithDescription = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>With Description</CardTitle>
        <CardDescription>Cards can also have descriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <p>You can add more details here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooterActions = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Action Card</CardTitle>
        <CardDescription>Includes footer with actions</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card contains buttons in the footer for actions.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  ),
};
