'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function SponsorForm({ data, onUpdate }) {
  const [sponsors, setSponsors] = useState(data.sponsor || []);
  const [newSponsor, setNewSponsor] = useState({
    nama: '',
    logo: '',
  });

  const handleAddSponsor = () => {
    if (!newSponsor.nama) {
      toast.error('Nama sponsor harus diisi');
      return;
    }

    if (
      sponsors.some(
        (s) => s.nama.toLowerCase() === newSponsor.nama.toLowerCase()
      )
    ) {
      toast.error('Nama sponsor sudah ada');
      return;
    }

    const updatedSponsors = [...sponsors, { ...newSponsor }];
    setSponsors(updatedSponsors);
    onUpdate({ sponsor: updatedSponsors });

    // Reset form
    setNewSponsor({ nama: '', logo: '' });
    toast.success('Sponsor ditambahkan');
  };

  const handleRemoveSponsor = (index) => {
    const updatedSponsors = sponsors.filter((_, i) => i !== index);
    setSponsors(updatedSponsors);
    onUpdate({ sponsor: updatedSponsors });
    toast.success('Sponsor dihapus');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="namaSponsors">Nama Sponsor</Label>
            <Input
              id="namaSponsor"
              placeholder="e.g., Bank Mandiri"
              value={newSponsor.nama}
              onChange={(e) =>
                setNewSponsor({ ...newSponsor, nama: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoSponsor">
              URL Logo Sponsor <span>(Opsional)</span>
            </Label>
            <Input
              id="logoSponsor"
              placeholder="https://example.com/logo.png"
              value={newSponsor.logo}
              onChange={(e) =>
                setNewSponsor({ ...newSponsor, logo: e.target.value })
              }
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAddSponsor}
          className="bg-[#fba635] hover:bg-[#fdac58]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Sponsor
        </Button>
      </div>

      {/* Sponsors List */}
      {sponsors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Daftar Sponsor ({sponsors.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {sponsors.map((sponsor, index) => (
              <Card key={index}>
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-3">
                      {sponsor.logo ? (
                        <Image
                          width={64}
                          height={64}
                          src={sponsor.logo}
                          alt={sponsor.nama}
                          className="h-16 w-16 rounded border object-contain"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{sponsor.nama}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveSponsor(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {sponsors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-gray-500">
              Belum ada sponsor ditambahkan (opsional)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
