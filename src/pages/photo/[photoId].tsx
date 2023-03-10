import Head from 'next/head';
import { fetchPhoto } from 'utils/fetchPhoto';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useLocalStorage from 'hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LocalStorageKeys, Photo } from 'types/types';

const DEFAULT_VALUE: number[] = [];

const SinglePhoto = () => {
	const [photo, setPhoto] = useState<Photo>();
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useLocalStorage<number[]>(
		DEFAULT_VALUE,
		LocalStorageKeys.LocalStorageKey
	);
	const {
		query: { photoId },
	} = useRouter();

	const handleShare = async () => {
		if ('share' in navigator) {
			try {
				await navigator.share({
					url: window.location.href,
					title: photo?.alt ? photo?.alt : 'Photo',
				});
			} catch (err) {
				if (err instanceof Error) toast.error(err.message);
			}
		} else {
			toast.error('Sharing is not supported');
		}
	};

	const removeFavourite = () => {
		setValue(value.filter((id) => id !== photo?.id));
	};

	const addFavourite = () => {
		setValue((value) => {
			return [...value, photo?.id || 0];
		});
	};

	useEffect(() => {
		if (typeof photoId != 'string') return;
		setIsLoading(true);
		fetchPhoto(photoId)
			.then(setPhoto)
			.catch((err) => {
				if (err instanceof Error) toast.error(err.message);
			})
			.finally(() => setIsLoading(false));
	}, [photoId]);

	return (
		<>
			<Head>
				<title>{photo?.alt ? photo?.alt : 'Photo'}</title>
				<meta name="description" content={photo?.alt ? photo?.alt : 'Photo'} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{isLoading ? (
				<p className="text-center">Loading...</p>
			) : (
				photo?.src?.large && (
					<div className="flex justify-center w-full">
						<div className="max-w-sm shadow-md rounded-xl">
							<Image
								src={photo?.src?.large}
								alt={photo?.alt ? photo?.alt : 'Photo'}
								width="350"
								height="250"
								className="w-auto h-auto p-0 rounded-md shadow-xl md:p-5"
								blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAKBweIx4ZKCMhIy0rKDA8ZEE8Nzc8e1hdSWSRgJmWj4CMiqC05sOgqtqtiozI/8va7vX///+bwf////r/5v3/+P/bAEMBKy0tPDU8dkFBdviljKX4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+P/AABEIAhcDcgMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQMEAv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8AwAe5yAAAAAAAAAAQBAAAAAABAAAEBFQUAAABAEAAEAAAQEVBQBARUAAQQAAAEARQAEAQAAQBAAARURQAAAABAAAAAAAAEAFAAAAAABUUABQAAAEAAFRVAAAAAAAAAAAAAAHUA9DIAAAAAAAAgAAIAAAAAIAAAAgIqCgAACCAAAAgCAACACgCCAAAIIAAioigAAIAAgIqAAIAAIAigAAAAIgogCoAKIAKgIoAACgAAAAACiKoAAACAAACiiKAAAAAAAAAAAADqAehkAAAABAVAAAQAAAAAAEAABABBQAAABFRAAABAAEAEAAFARAAARUQAAEVEUAARUAAQEVAAEAEFAEAAAAEAQAAAAAAABAAFEVQAAAAAAVBRRFAAAAEAFAABUAUQBQAAAAAAAdQg9DKoCAAAAAAAAAAAIAAAAAAiCoAoAACAAIAAIAAAgIAoAgIAAAIAgAAgCKAAgCACAAIAACAKAIAICoCAAAAAAAAAAAAIAKCoAoigAAAKAAKIAoAgAoAAAAAAAAAAAAAA6gHdkAAAAAAEAUQAAAAAAQAQAAUAAEAAEAABAAAQEAAAUBEAABFRAAAQAAEUQAAEBAAAQEAABFAQAAABAAAAAAABAUQBQBAAABQAAVAFEUABQAAAEFQBRBRRFAAAAAAAAAAB1CDuyAAAAAAAAAAAiCiAAAoAACAqAgAAAgKgAAICAAAKAiAAACAAICKgACKIqAAICAAAAgIAAAIigAAAAIgAAAAAAAAAAAAACKIKKIoAAAAACiiAKICKAAAoAAAAAAAAAAAA6hB2ZUQBRAFEAVAAAAAFAABAFQAAEAAAQAAABEFQAABQQQAAAQABAQAAABBFAAEVEAABAQAAARFAAAQFQEAAAEBRAFEAVABRAFEAUQEUAABQAAVAFEFFEAUAAAQAAAUFQBRAFEAUQBRAHUA7IAAAACAKIAogCoAACAAAIAqAAAACIKgAAAAgqoCACAqAAAgIAAACAigACAgAAIAACAgAAIogAAIAICoAAAACAIAogCiCiiAKIoAAgAoKgCiAKIAoiqAAAAgACiAKIKKIAogCiAKIA6gHZABAAAAABAUQBRAFQAAAAABBBUAAAAQFVAQAABAAAAQQAAAQFQEUBAVAQAQAAAEQVAABEVUAAEBUBABAUQAAQAQFEAUQBRAFEAUQUURQABABRRAFEAUQBQFAAAAFEAUQEUQBRAFEAUQB1AOyAAAAAAAICiAKIAoggAAAACAKICgCACAqAAAAIIAAAICoAACKCAACAIAAACCAAAIIoCAqAACIKgAAiCoAAAAgCiCKogCiCoogCiAKIKKAAAAqCiiAKIAogCgKgAAqAKIAogCiAKIAogDqAdWQAAAAAAQBRAFEAUQFAAAABBBRAAAAEBRBAAABAVAAAQBAUAAEEAAAEAAQAQAAUEEAEBUBABAVAQBAFQEUAAAQAAAAAAAAAFoAFABQAAAUFQEUQBRBRQAAAAAAFAAAAAAAAHUCOrKiAKIAogCiCCiAKIAAAAACAKIAqAAAgCAKIAAAAiCiAoAAIIAAAgCoAAIgqAAIIoAAIAAiCoAAggAIoAgAAAAAAAAAAAAAAAAAAAAAAALQAKAC0AAAFAAQVAFEAUQUUQBRAFEAdQg6sqIAogCiAKIAqAAAACIKIAogCiAAAAICiCCiAoAAIAqAgAgKIAAACCCoAAgAAiggACAqAgCCAAVQBAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFoAFAAoALQAKABQAKABR0AOzAAAAAAAAACAogCiAKIAoggAAAgqiAKIAAACCCiAAAAgCoCACAogACIqoAAICoCAIAAJVAEoAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANxB3ZUQBRAFEAUQBRAFEAUQAAAAAEAUQQUQAAAEAUQBUBABAUQAAAEEUAAEAAEAQAASqAJQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbCDuyogCoAAAACAAAIAogCiAKIAogAAAIAoggogAAAICqIIAAAgCoCACAoggAJVACgAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0EHZlRAFEAUQBRAFEAUQBRBAAAEBVEAUQBRAAAAQQUQBUAAEQUQBRBKABVAEoAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQDqgAAAAIAogCiAKIAogCiAKIIKgAAAAgKIAoggqAKAJQAKACUAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAdEAAAAAAAAAQFEAUQBRBBUAAAUAAAQACgAlAAoAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADaAAAAAAAAoAAAAAgAAAAAIAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2AAAAACAAAAAAAAAAgAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYAAAAAAAAAIAAAAAAACAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjoiCiCCgIKAgoCCgIKAgoCACgCAAAAgAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKKOiIKAgoCCgIKAgoCCgIKAgCAAAACCgIKIIKgoAkABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7AdWQAAAAAEFEEFAQUBBQEFAQAAAURRBBQEFAQAABBBRBBUFAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGgDqyAAAAAAAAAAgoCCgIKAgoggAAAIKAgoCAIAAqCgIKiAiiCCiCACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANQHZkAAAAAAAAAQQUBBQEFAQVAAAAAQUQQVAAAAAQUQQVBQBBBQEAQQUQQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsA7MAAAAAAAAIKAgoCCgIKgoAgAAIoCCgIAAAgIoCCoAAgIoCCoigAIKIIAgIoggqKoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACggoIgoCCiCKAAAAAAAAAAAAAAANRR6GUFEEFAQUBBQEFAQAAAAAAABFBUFEEAAABBQEFRAAAABBUQAAEURUFQBFEEAZAAAAVBRRBQEAAAAAAAAAAAAAAAAAAAAAABQQUBFBEAAAAAAAAAABQEFAQUBBQEFARQAAAAAABqA9DIAAAAAAAAAAAAAggoCCoAAAAAAKgoggAAACKAgCAAAiiCAAAIqCogIoggqIAAAAoAAAAigIKKIKAgoCCgIKAgoAAgAAAAACAAAAAAAoCKAAAAAAAAAAAAAAAAAAAAAAANgHoZAAAAQUBBQEFQAAAAAAABARQEFQAAAAUAQQVAAAAEEFQAABFEEARQAEFRAAZEFAQAAAUAAAAAAAAAAAAAAAAAAAEAAAUEUAAAAAAAAAAAAABQEFEEFAAAAAAAAAAAAAagPSyAAAAAAAAAAIoCCoAAAAAAgAAgqAAAAIoACAAAAAIIAAAgIoCAIoAggCaACAigIAKAAAAAAAAAAAAAAAAAAAAKAgAAAAAAAAAAAAoAAIAAAAAAAAAAAAAAAAAANQHpZAAAAAAAAAAAAAAQVAAAAEAAAAEFQAAUAQEUBAAAEBFQABAABAEUAQQVEABAABBUFAAAAAAAAAAAAAAAAAAFAQAAAAAAAAAAAAUAAEAAAAAAAAAAAAAAAAAAAAGoD0sgAAAAAAAAAAAAACAAAAAAAgAAIAAAoAgAAgAACAgAAIAACAigCAgIACAAAgCgAAAAAAAAAAAAAAACgAAIAAAAAAAAAAAAoCAAAAAAAAAAAAAAAAAAAAAAD/2Q=="
								placeholder="blur"
							/>
							<div className="p-5">
								<h5 className="mb-2 text-2xl font-bold tracking-tight text-center text-secondary">
									{photo?.alt}
								</h5>
								<div className="flex justify-between">
									{value.includes(photo?.id) ? (
										<button
											className="p-2 rounded-lg bg-primary text-basic"
											onClick={removeFavourite}
										>
											Remove from favourites
										</button>
									) : (
										<button
											className="p-2 rounded-lg bg-primary text-basic"
											onClick={addFavourite}
										>
											Add to Favourites
										</button>
									)}
									<button
										className="p-2 rounded-lg bg-primary text-basic"
										onClick={handleShare}
									>
										Share
									</button>
								</div>
							</div>
						</div>
					</div>
				)
			)}
		</>
	);
};

export default SinglePhoto;
