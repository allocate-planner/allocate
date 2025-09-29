import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface IProps {
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImportTab = ({ handleUpload }: IProps) => {
  return (
    <section className="w-full flex flex-col space-y-8 p-8">
      <div className="space-y-8">
        <div className="flex flex-row space-x-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
            <ArrowUpTrayIcon aria-hidden="true" className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-base">Calendar Import</h1>
            <p className="text-gray-500 text-sm">
              Import your existing calendar data from .ics files
            </p>
          </div>
        </div>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <ArrowUpTrayIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
            <div className="mt-4 flex text-sm/6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs/5 text-gray-600">.ics format supported</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportTab;
