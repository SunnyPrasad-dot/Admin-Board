import { useState } from "react";
import { useGetPackages, useGetAddons, useUpdatePackage, useUpdateAddon } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Check, X } from "lucide-react";

function EditableRow({ item, onSave, columns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(item);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(item.id, values);
    setIsEditing(false);
    toast({ title: "Updated successfully", description: "The changes have been saved." });
  };

  const handleCancel = () => {
    setValues(item);
    setIsEditing(false);
  };

  return (
    <TableRow>
      {columns.map((col) => (
        <TableCell key={col.key}>
          {isEditing && col.editable ? (
            <Input 
              value={values[col.key]} 
              onChange={(e) => {
                const val = col.type === "number" ? parseFloat(e.target.value) : e.target.value;
                setValues({ ...values, [col.key]: val });
              }}
              type={col.type || "text"}
              className="h-8 py-1 px-2"
            />
          ) : (
            col.type === "number" ? `$${item[col.key]}` : item[col.key]
          )}
        </TableCell>
      ))}
      <TableCell className="text-right">
        {isEditing ? (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Check className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8 text-red-600"><X className="h-4 w-4" /></Button>
          </div>
        ) : (
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8 text-muted-foreground"><Pencil className="h-4 w-4" /></Button>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function Prices() {
  const { data: packages, isLoading: isLoadingPackages } = useGetPackages();
  const { data: addons, isLoading: isLoadingAddons } = useGetAddons();
  const updatePackage = useUpdatePackage();
  const updateAddon = useUpdateAddon();
  
  const handleSavePackage = (id, data) => updatePackage.mutate({ id, data });
  const handleSaveAddon = (id, data) => updateAddon.mutate({ id, data });

  const packageColumns = [
    { key: "name", label: "Name", editable: true },
    { key: "category", label: "Category", editable: true },
    { key: "price", label: "Price", editable: true, type: "number" },
    { key: "duration", label: "Duration", editable: true },
  ];

  const addonColumns = [
    { key: "name", label: "Name", editable: true },
    { key: "price", label: "Price", editable: true, type: "number" },
    { key: "description", label: "Description", editable: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Price Management</h1>
        <Button>Add New</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPackages ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {packageColumns.map(c => <TableHead key={c.key}>{c.label}</TableHead>)}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages?.map(pkg => (
                    <EditableRow key={pkg.id} item={pkg} columns={packageColumns} onSave={handleSavePackage} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add-ons</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAddons ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {addonColumns.map(c => <TableHead key={c.key}>{c.label}</TableHead>)}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addons?.map(addon => (
                    <EditableRow key={addon.id} item={addon} columns={addonColumns} onSave={handleSaveAddon} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}