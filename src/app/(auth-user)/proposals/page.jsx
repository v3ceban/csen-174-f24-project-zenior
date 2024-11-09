"use client"
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Link from "next/link";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";
// import { prisma } from "@prisma/client";
import { proposals } from "@/lib/server/proposals";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


export default function Proposals() {
  //const rows = await proposals(0, 2);
  const [selectedItems, setSelectedItems] = useState([]);
  const [radioSelections, setRadioSelections] = useState({
    "Interdisciplinary?": null,
    "Openings for additional members?": 9,
    "Has an advisor already?": null,
  });
  const [filteredRows, setFilteredRows] = useState([]);

  React.useEffect(() => {
    //fetch proposals from db with applied filters
    const fetchFilteredProposals = async() => {
      const filters = {
        departmentIds: selectedItems.length ? selectedItems : undefined,
        isInterdisciplinary: radioSelections["Interdisciplinary?"] === 7,
        hasOpenings: radioSelections["Openings for additional members?"] === 9,
        hasAdvisor: radioSelections["Has an advisor already?"] === 11,
      };

      const results = await proposals(0, 5, filters);
      setFilteredRows(results);
    };
    fetchFilteredProposals();
  }, [selectedItems, radioSelections]);


  return (
    <div className="px-8 m-9">
      <div className="flex flex-row">
        <div>
          <SidebarProvider className="pr-8">
            <AppSidebar 
              selectedItems = {selectedItems}
              setSelectedItems = {setSelectedItems}
              radioSelections = {radioSelections}
              setRadioSelections = {setRadioSelections}
            />
          </SidebarProvider>
        </div>

        <div>
          <h1 className="font-black text-3xl pb-6">Project Proposals</h1>
          <div className="flex flex-row ">
            <p className="pr-4 pb-8">Add Your Own Proposal</p>
            <Link href={`/proposal-form`}>
              <Plus size="20" color={"#b30738"} />
            </Link>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow
                    key={row.title}
                    sx={{ "&:last-child td, &last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" colSpan={4}>
                      <div className="flex flex-col p-4 rounded-lg space-y2">
                        <a
                          href={`/proposals/${row.id}`}
                          className="underline text-[#b30738] text-xl font-bold"
                        >
                          {row.title}
                        </a>
                        <div>
                          {row.description.length > 280 ? (
                            <>
                              {row.description.slice(0, 280)}...
                              <a
                                href={`/proposals/${row.id}`}
                                className="underline text-[#b30738]"
                              >
                                Read more
                              </a>
                            </>
                          ) : (
                            row.description
                          )}
                        </div>
                        <br></br>
                        <div>
                          <span className="font-semibold">Advisor</span>:
                          <span> {row.advisor}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div>
        <Pagination className="content-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
